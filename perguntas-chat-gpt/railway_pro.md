## Railway Pro

## ✅ Resumo do seu projeto

Você terá:

* Um **frontend em Vercel** (landing + dashboard).
* Um **backend ou API** hospedado no Railway.
* Um **banco de dados relacional** (PostgreSQL recomendado).
* Funcionalidades:

  * Cadastro/login de alunos.
  * Registro de pagamentos.
  * Perfil com dieta, treinos, fotos, peso etc.
  * Acesso a vídeos (YouTube).
  * Crescimento futuro em tabelas e dados.

---

## ✅ O que o **Railway Pro** oferece por \$20/mês

| Recurso                   | Limite do Pro Plan (\$20/mês)             |
| ------------------------- | ----------------------------------------- |
| Armazenamento de dados    | **Up to 1 GB de dados persistentes** (DB) |
| Uso de CPU / RAM          | 512 MB de RAM por serviço por padrão      |
| Tráfego de saída (egress) | 1 TB por mês                              |
| Build time                | 500 minutos/mês                           |
| Deploys automáticos (Git) | ✅ Sim                                     |
| Domínios customizados     | ✅ Sim (para APIs)                         |
| Variáveis de ambiente     | ✅ Sim                                     |
| Suporte a banco de dados  | ✅ PostgreSQL, MySQL, Redis, etc.          |

---

## 📊 E para até **300 alunos**?

Sim, **é viável com folga**, considerando:

* **DB com poucos MBs por aluno** (mesmo com fotos e registros leves).
* **Uso de YouTube para vídeos** (ótima decisão: evita armazenar vídeo pesado no backend).
* Back-end com **funções específicas** (auth, CRUD, pagamentos, uploads, etc.).
* Tráfego moderado no início.

Exemplo de uso de DB com 300 alunos:

* 300 usuários x \~50KB de dados = \~15MB.
* Mesmo com crescimento e tabelas adicionais, você deve **ficar longe de 1GB** por um bom tempo.

---

## ⚠️ Cuidados e limites

| Pontos de atenção                           | Observação                                                                                                                        |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Uploads de imagens** (fotos de progresso) | Use serviços como **Cloudinary**, **S3**, ou **UploadThing** para não sobrecarregar o Railway.                                    |
| **Pagamentos**                              | Use serviços como **Stripe**, **Mercado Pago**, ou **Pagar.me**, para gerenciar pagamentos fora da infra.                         |
| **Escalabilidade futura**                   | Para mais de 1000+ alunos, talvez você precise subir para o plano Team ou usar uma infra mais robusta, mas isso virá com o tempo. |
| **Backups**                                 | Configure **backups automáticos** no Railway para seu DB.                                                                         |

---

## 🔄 Vercel + Railway: combinação ideal?

Sim! Essa stack é super comum em 2024/2025:

* Frontend: **Next.js na Vercel** (rápido, escalável, ótimo para SEO e SSR).
* Backend/API + DB: **Railway** (fácil, CI/CD, PostgreSQL integrado).
* Arquivos pesados: **Serviços externos como S3 ou Cloudinary**.
* Pagamentos: **Stripe / Mercado Pago / Pagar.me**.

---

## ✅ Conclusão: Vale a pena?

| Item                                   | Railway Pro (20 USD/mês)  |
| -------------------------------------- | ------------------------- |
| Ideal para até 300 alunos              | ✅ Sim                     |
| Suporta backend + banco no mesmo plano | ✅ Sim                     |
| Compatível com Vercel frontend         | ✅ Sim                     |
| Custo-benefício para MVP / early stage | ✅ Excelente               |
| Crescimento gradual com escala         | ✅ Dá pra crescer bastante |
