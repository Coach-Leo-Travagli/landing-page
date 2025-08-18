import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Types based on Prisma schema
interface QuestionOption {
  id: string;
  text: string;
  value?: string;
  order: number;
}

interface Question {
  id: string;
  title: string;
  description?: string;
  type: 'TEXT' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'NUMBER' | 'DATE' | 'IMAGE';
  config?: any;
  isRequired: boolean;
  order: number;
  options: QuestionOption[];
}

interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  videoUrl?: string;
  questions: Question[];
}

interface FormAnswer {
  questionId: string;
  textAnswer?: string;
  selectedOptions?: string[]; // Array of option IDs
}

const FormUser: React.FC = () => {
  const { formId, userId } = useParams<{ formId: string; userId: string }>();
  const navigate = useNavigate();
  
  const [formTemplate, setFormTemplate] = useState<FormTemplate | null>(null);
  const [answers, setAnswers] = useState<Record<string, FormAnswer>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Load form template
  useEffect(() => {
    const fetchForm = async () => {
      if (!formId || !userId) {
        setError("ID do formulário ou usuário não encontrado na URL");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/forms/${formId}?userId=${userId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erro ao carregar formulário");
        }

        setFormTemplate(data.formTemplate);
        
        // Check if form was already answered
        if (data.existingResponse) {
          setSubmitted(true);
        }
      } catch (err) {
        console.error("Error fetching form:", err);
        setError(err instanceof Error ? err.message : "Erro ao carregar formulário");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId, userId]);

  const handleAnswerChange = (questionId: string, answer: Partial<FormAnswer>) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        ...answer
      }
    }));
  };

  const validateAnswers = (): string[] => {
    const errors: string[] = [];
    
    if (!formTemplate) return errors;

    formTemplate.questions.forEach(question => {
      if (question.isRequired) {
        const answer = answers[question.id];
        
        if (!answer) {
          errors.push(`Pergunta "${question.title}" é obrigatória`);
          return;
        }

        switch (question.type) {
          case 'TEXT':
          case 'NUMBER':
          case 'DATE':
          case 'IMAGE':
            if (!answer.textAnswer?.trim()) {
              errors.push(`Pergunta "${question.title}" é obrigatória`);
            }
            break;
          case 'SINGLE_CHOICE':
            if (!answer.selectedOptions?.length) {
              errors.push(`Pergunta "${question.title}" é obrigatória`);
            }
            break;
          case 'MULTIPLE_CHOICE':
            if (!answer.selectedOptions?.length) {
              errors.push(`Pergunta "${question.title}" é obrigatória`);
            }
            break;
        }
      }
    });

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateAnswers();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/forms/${formId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          answers: Object.values(answers)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar formulário");
      }

      setSubmitted(true);
      toast.success("Formulário enviado com sucesso!");
      
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(err instanceof Error ? err.message : "Erro ao enviar formulário");
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const answer = answers[question.id];

    switch (question.type) {
      case 'TEXT':
        const isLongText = question.config?.text_long || question.config?.multiline;
        
        return isLongText ? (
          <Textarea
            value={answer?.textAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, { textAnswer: e.target.value })}
            placeholder="Digite sua resposta..."
            className="min-h-[100px]"
            maxLength={question.config?.maxLength}
            required={question.isRequired}
          />
        ) : (
          <Input
            value={answer?.textAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, { textAnswer: e.target.value })}
            placeholder="Digite sua resposta..."
            maxLength={question.config?.maxLength}
            required={question.isRequired}
          />
        );

      case 'NUMBER':
        return (
          <Input
            type="number"
            value={answer?.textAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, { textAnswer: e.target.value })}
            placeholder="Digite um número..."
            required={question.isRequired}
          />
        );

      case 'DATE':
        return (
          <Input
            type="date"
            value={answer?.textAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, { textAnswer: e.target.value })}
            required={question.isRequired}
          />
        );

      case 'SINGLE_CHOICE':
        return (
          <RadioGroup
            value={answer?.selectedOptions?.[0] || ''}
            onValueChange={(value) => handleAnswerChange(question.id, { selectedOptions: [value] })}
            required={question.isRequired}
          >
            {question.options
              .sort((a, b) => a.order - b.order)
              .map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
          </RadioGroup>
        );

      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-3">
            {question.options
              .sort((a, b) => a.order - b.order)
              .map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={answer?.selectedOptions?.includes(option.id) || false}
                    onCheckedChange={(checked) => {
                      const currentOptions = answer?.selectedOptions || [];
                      const newOptions = checked
                        ? [...currentOptions, option.id]
                        : currentOptions.filter(id => id !== option.id);
                      
                      handleAnswerChange(question.id, { selectedOptions: newOptions });
                    }}
                  />
                  <Label htmlFor={option.id} className="cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
          </div>
        );

      case 'IMAGE':
        return (
          <div className="space-y-2">
            <Input
              type="url"
              value={answer?.textAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, { textAnswer: e.target.value })}
              placeholder="Cole o link da imagem aqui..."
              required={question.isRequired}
            />
            <p className="text-sm text-muted-foreground">
              Cole um link válido para sua imagem (ex: de um drive compartilhado)
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando formulário...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Erro</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => navigate('/')} variant="outline">
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Formulário Enviado!</h2>
              <p className="text-muted-foreground mb-4">
                Suas respostas foram enviadas com sucesso. Obrigado por participar!
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!formTemplate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Formulário não encontrado</h2>
              <p className="text-muted-foreground mb-4">
                O formulário solicitado não foi encontrado ou não está mais disponível.
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{formTemplate.name}</CardTitle>
            {formTemplate.description && (
              <p className="text-muted-foreground">{formTemplate.description}</p>
            )}
          </CardHeader>
          
          <CardContent>
            {formTemplate.videoUrl && (
              <div className="mb-8">
                <h3 className="font-semibold mb-4">Vídeo Explicativo</h3>
                <div className="aspect-video">
                  <iframe
                    src={formTemplate.videoUrl}
                    title="Vídeo explicativo do formulário"
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {formTemplate.questions
                .sort((a, b) => a.order - b.order)
                .map((question, index) => (
                  <div key={question.id} className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">
                        {index + 1}. {question.title}
                        {question.isRequired && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      {question.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {question.description}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      {renderQuestion(question)}
                    </div>
                  </div>
                ))}

              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {submitting ? 'Enviando...' : 'Enviar Formulário'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/')}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormUser;
