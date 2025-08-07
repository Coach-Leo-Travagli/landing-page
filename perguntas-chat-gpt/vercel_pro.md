## Vercel Pro

### ✅ **1. O que você ganha com o Vercel Pro?**

**Comparado ao plano gratuito**, o Pro oferece:

* **Hospedagem incluída** (sem custos extras por GBs de tráfego ou builds dentro dos limites do plano).
* **Maior performance e escalabilidade** (tempo de execução e builds mais rápidos).
* **Preview ilimitados e com controle de acesso**.
* **Maior limite de builds e requisições**.
* **Ambientes de preview protegidos por senha**.
* **Suporte a times (mais de 1 colaborador)**.
* **Controle avançado de ambiente (mais variáveis, criptografia etc).**
* **Suporte técnico prioritário**.
* **500 GB de largura de banda e 1.000 horas de execução por mês**.
* **Builds simultâneos (evita filas)**.

> É um plano ideal para pequenos times ou freelancers profissionais que querem performance, estabilidade e controle.

---

### ✅ **2. A hospedagem está inclusa?**

**Sim, está totalmente inclusa.**

Você não paga nada a mais para hospedar seus sites e APIs (desde que dentro dos limites de uso do plano). A Vercel hospeda seu front-end (e APIs serverless, se usar).

---

### ✅ **3. Posso apontar para meu domínio `.com.br` que comprei?**

**Sim! Pode usar seu domínio personalizado.**

A Vercel permite que você aponte qualquer domínio (inclusive `.com.br`) para seus projetos. Basta:

* Adicionar o domínio no projeto via painel da Vercel.
* Atualizar os **DNS** no seu provedor (como Registro.br, GoDaddy, etc.) com os registros indicados pela Vercel.
* A Vercel configura automaticamente **HTTPS (SSL)** gratuito.

---

### ✅ **4. Posso criar deploys automáticos para a branch `main` no domínio `.com.br` e para a branch `develop` em um domínio da Vercel?**

**Sim, isso é exatamente o tipo de fluxo que a Vercel suporta:**

#### 💡 Fluxo típico:

* Branch `main`:

  * Deploy automático na **produção** (domínio `.com.br`).
* Branch `develop` (ou qualquer outra):

  * Deploy automático em um **Preview Domain**, do tipo `meusite-git-develop.vercel.app`.

#### 💡 Além disso, você pode:

* **Configurar aliases personalizados para outras branches**, como `dev.meusite.com.br`, se quiser.
* Usar **ambientes separados** com variáveis diferentes para `main`, `develop`, etc.

---

### 🧠 Exemplo de configuração:

| Branch    | Deploy automático? | URL Final                                                            |
| --------- | ------------------ | -------------------------------------------------------------------- |
| `main`    | ✅                  | `www.meusite.com.br`                                                 |
| `develop` | ✅                  | `meusite-git-develop.vercel.app` (ou `dev.meusite.com.br` se quiser) |

---

### ✅ Resumo final:

| Recurso                      | Disponível no Pro? |
| ---------------------------- | ------------------ |
| Hospedagem inclusa           | ✅ Sim              |
| Domínio `.com.br` próprio    | ✅ Sim              |
| Deploy automático por branch | ✅ Sim              |
| Preview URLs personalizadas  | ✅ Sim              |
| Certificado SSL incluso      | ✅ Sim              |
| Ambiente separado por branch | ✅ Sim              |



--------------------------------



### ✅ **Cenário: Landing Page + Aplicação principal**

Você pode configurar assim:

#### 🧱 Projeto 1: Landing Page

* Framework: Next.js, Astro, React, etc.
* Branch principal: `main`
* Domínio: `www.seusite.com.br`
* Deploy automático a cada push no `main`.

#### 🧱 Projeto 2: Aplicação (dashboard, login, etc.)

* Framework: Next.js, React, etc.
* Branch principal: `main`
* Domínio: `app.seusite.com.br` ou `painel.seusite.com.br`
* Deploy automático a cada push no `main`.

---

### 💡 **Como funciona na prática:**

* Cada projeto tem seu repositório Git separado **(ou o mesmo repo com paths separados)**.
* Você configura os **domínios individualmente por projeto**.
* Cada um tem seus próprios ambientes, variáveis, preview deploys etc.

---

### 🌐 **Exemplo de estrutura com domínios:**

| Projeto       | URL de Produção      | Branch | URL de Preview                   |
| ------------- | -------------------- | ------ | -------------------------------- |
| Landing Page  | `www.seusite.com.br` | `main` | `landing-git-feature.vercel.app` |
| Aplicação Web | `app.seusite.com.br` | `main` | `app-git-develop.vercel.app`     |

Você pode também usar subpastas (tipo `seusite.com.br/app`) **mas isso não é o ideal** com apps modernas — subdomínios são mais limpos e escaláveis.

---

### ✅ **Limites de Projetos no Vercel Pro**

* **Quantidade de projetos**: **Ilimitada** (dentro do uso justo e limites de build/runtime).
* **Deploys automáticos e previews por projeto**: Sim.
* **Domínios customizados por projeto**: Sim, quantos quiser.

---

### 📌 Resumo:

| Funcionalidade                            | É possível? |
| ----------------------------------------- | ----------- |
| Ter 2+ projetos separados (landing + app) | ✅ Sim       |
| Deploy automático para cada um            | ✅ Sim       |
| Domínios diferentes por projeto           | ✅ Sim       |
| Subdomínios como `app.seusite.com.br`     | ✅ Sim       |
| Deploys Preview por projeto               | ✅ Sim       |