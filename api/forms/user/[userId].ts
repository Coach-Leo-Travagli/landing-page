import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

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
        error: 'Acesso negado. É necessário ter uma assinatura ativa para ver formulários.' 
      });
    }

    // Buscar todos os formulários ativos
    const formTemplates = await prisma.formTemplate.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        videoUrl: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Buscar respostas já enviadas pelo usuário
    const userResponses = await prisma.formResponse.findMany({
      where: { userId: userId },
      select: {
        formTemplateId: true,
        completedAt: true
      }
    });

    // Criar mapa de formulários já respondidos
    const answeredFormsMap = new Map(
      userResponses.map(response => [
        response.formTemplateId, 
        response.completedAt
      ])
    );

    // Combinar informações
    const formsWithStatus = formTemplates.map(form => ({
      id: form.id,
      name: form.name,
      description: form.description,
      videoUrl: form.videoUrl,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
      status: answeredFormsMap.has(form.id) ? 'completed' : 'pending',
      completedAt: answeredFormsMap.get(form.id) || null,
      formUrl: `/form/${form.id}/user/${userId}`
    }));

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        planType: user.planType
      },
      forms: formsWithStatus,
      totalForms: formsWithStatus.length,
      completedForms: formsWithStatus.filter(f => f.status === 'completed').length,
      pendingForms: formsWithStatus.filter(f => f.status === 'pending').length
    });

  } catch (error) {
    console.error('Error fetching user forms:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor ao buscar formulários do usuário' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
