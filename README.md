# ATHA Security — Site oficial

Site do ATHA Security (Next.js 16 + TypeScript + Tailwind + Prisma).

## Rodar local

```bash
npm install
cp .env.example .env
npm run dev
```

Abra http://localhost:3000

## Deploy (Vercel)

1. Importe este repo na Vercel (vercel.com/new)
2. Em **Environment Variables**, adicione:
   - `DATABASE_URL` = `file:./db/custom.db`
3. **Deploy** — pronto.

## Área de planos

- Preços em Euro por padrão, com troca para Dólar/Real
- CTAs de compra e dúvidas de preço abrem o WhatsApp do dono
  (número configurado em `src/components/sections/PlansSection.tsx` → `WA_NUMBER`)
