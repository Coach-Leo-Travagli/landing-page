import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formId } = req.query;
    const { userId } = req.query;

    if (!formId || typeof formId !== 'string') {
      return res.status(400).json({ error: 'Form ID is required' });
    }

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Verificar se o usuário existe e tem uma assinatura ativa
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        subscriptionId: true,
        planType: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (!user.subscriptionId) {
      return res.status(403).json({ 
        error: 'Acesso negado. É necessário ter uma assinatura ativa para responder formulários.' 
      });
    }

    // Buscar o template do formulário com suas perguntas e opções
    const formTemplate = await prisma.formTemplate.findUnique({
      where: { 
        id: formId,
        isActive: true 
      },
      include: {
        questions: {
          include: {
            options: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!formTemplate) {
      return res.status(404).json({ error: 'Formulário não encontrado ou não está ativo' });
    }

    // Verificar se o usuário já respondeu este formulário
    const existingResponse = await prisma.formResponse.findFirst({
      where: {
        formTemplateId: formId,
        userId: userId
      },
      include: {
        questionAnswers: {
          include: {
            selectedOptions: {
              include: {
                option: true
              }
            }
          }
        }
      }
    });

    return res.status(200).json({
      formTemplate: {
        id: formTemplate.id,
        name: formTemplate.name,
        description: formTemplate.description,
        videoUrl: formTemplate.videoUrl,
        questions: formTemplate.questions.map(question => ({
          id: question.id,
          title: question.title,
          description: question.description,
          type: question.type,
          config: question.config,
          isRequired: question.isRequired,
          order: question.order,
          options: question.options.map(option => ({
            id: option.id,
            text: option.text,
            value: option.value,
            order: option.order
          }))
        }))
      },
      user: {
        id: user.id,
        name: user.name,
        planType: user.planType
      },
      existingResponse: existingResponse ? {
        id: existingResponse.id,
        completedAt: existingResponse.completedAt,
        answers: existingResponse.questionAnswers.map(qa => ({
          questionId: qa.questionId,
          textAnswer: qa.textAnswer,
          selectedOptions: qa.selectedOptions.map(so => so.optionId)
        }))
      } : null
    });

  } catch (error) {
    console.error('Error fetching form:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor ao buscar formulário' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
