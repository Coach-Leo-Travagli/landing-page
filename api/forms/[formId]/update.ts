import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FormAnswer {
  questionId: string;
  textAnswer?: string;
  selectedOptions?: string[]; // Array of option IDs
}

interface UpdateFormRequest {
  userId: string;
  responseId: string;
  answers: FormAnswer[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formId } = req.query;
    const { userId, responseId, answers }: UpdateFormRequest = req.body;

    if (!formId || typeof formId !== 'string') {
      return res.status(400).json({ error: 'Form ID is required' });
    }

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!responseId || typeof responseId !== 'string') {
      return res.status(400).json({ error: 'Response ID is required' });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers are required' });
    }

    // Verificar se o usuário existe e tem uma assinatura ativa
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        subscriptionId: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (!user.subscriptionId) {
      return res.status(403).json({ 
        error: 'Acesso negado. É necessário ter uma assinatura ativa para atualizar formulários.' 
      });
    }

    // Verificar se o FormResponse existe e pertence ao usuário
    const existingResponse = await prisma.formResponse.findFirst({
      where: {
        id: responseId,
        formTemplateId: formId,
        userId: userId
      }
    });

    if (!existingResponse) {
      return res.status(404).json({ 
        error: 'Resposta do formulário não encontrada ou não pertence a este usuário' 
      });
    }

    // Verificar se o formulário existe e está ativo
    const formTemplate = await prisma.formTemplate.findUnique({
      where: { 
        id: formId,
        isActive: true 
      },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    if (!formTemplate) {
      return res.status(404).json({ error: 'Formulário não encontrado ou não está ativo' });
    }

    // Validar as respostas
    const questionMap = new Map(formTemplate.questions.map(q => [q.id, q]));
    const validationErrors: string[] = [];

    // Verificar perguntas obrigatórias
    for (const question of formTemplate.questions) {
      if (question.isRequired) {
        const answer = answers.find(a => a.questionId === question.id);
        
        if (!answer) {
          validationErrors.push(`Pergunta "${question.title}" é obrigatória`);
          continue;
        }

        switch (question.type) {
          case 'TEXT':
          case 'NUMBER':
          case 'DATE':
          case 'IMAGE':
            if (!answer.textAnswer?.trim()) {
              validationErrors.push(`Pergunta "${question.title}" é obrigatória`);
            }
            break;
          case 'SINGLE_CHOICE':
          case 'MULTIPLE_CHOICE':
            if (!answer.selectedOptions?.length) {
              validationErrors.push(`Pergunta "${question.title}" é obrigatória`);
            }
            break;
        }
      }
    }

    // Validar opções selecionadas
    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (!question) {
        validationErrors.push(`Pergunta com ID ${answer.questionId} não encontrada`);
        continue;
      }

      if (answer.selectedOptions) {
        const validOptionIds = question.options.map(o => o.id);
        const invalidOptions = answer.selectedOptions.filter(optionId => 
          !validOptionIds.includes(optionId)
        );

        if (invalidOptions.length > 0) {
          validationErrors.push(`Opções inválidas para pergunta "${question.title}"`);
        }

        // Validar single choice
        if (question.type === 'SINGLE_CHOICE' && answer.selectedOptions.length > 1) {
          validationErrors.push(`Pergunta "${question.title}" aceita apenas uma opção`);
        }
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Erro de validação', 
        details: validationErrors 
      });
    }

    // Usar transação para atualizar as respostas
    const result = await prisma.$transaction(async (tx) => {
      // Atualizar a data de modificação da resposta
      const updatedFormResponse = await tx.formResponse.update({
        where: { id: responseId },
        data: {
          updatedAt: new Date()
        }
      });

      // Remover todas as respostas antigas das perguntas
      await tx.questionAnswer.deleteMany({
        where: {
          formResponseId: responseId
        }
      });

      // Criar as novas respostas
      for (const answer of answers) {
        const questionAnswer = await tx.questionAnswer.create({
          data: {
            formResponseId: responseId,
            questionId: answer.questionId,
            textAnswer: answer.textAnswer || null
          }
        });

        // Salvar opções selecionadas para perguntas de múltipla escolha
        if (answer.selectedOptions && answer.selectedOptions.length > 0) {
          await tx.questionAnswerOption.createMany({
            data: answer.selectedOptions.map(optionId => ({
              questionAnswerId: questionAnswer.id,
              optionId: optionId
            }))
          });
        }
      }

      return updatedFormResponse;
    });

    return res.status(200).json({
      success: true,
      message: 'Formulário atualizado com sucesso',
      formResponseId: result.id,
      updatedAt: result.updatedAt
    });

  } catch (error) {
    console.error('Error updating form:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor ao atualizar formulário' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
