# 🎨 GUIA DE CORES - MORENA CONCEPT v1.2.1

## Paleta Oficial MORENA CONCEPT

Implementação completa das cores do Brandbook no ERP!

---

## 🎯 Cores Primárias

### 1. Preto Elegante - `brand-black`
```
Hex: #373435
RGB: 55, 52, 53
CMYK: 0, 0, 0, 100%
Uso: Navbar, texto principal, navegação, fundos sólidos
```

### 2. Rosa Magenta - `brand-pink`
```
Hex: #FF43A3
RGB: 255, 67, 163
CMYK: 0, 74, 36, 0%
Uso: Botões principais, destaques, acentos, logo
```

---

## 🌈 Cores Secundárias

### 3. Cinza Neutro - `brand-gray`
```
Hex: #BDBFC1
RGB: 189, 191, 193
CMYK: 0, 0, 0, 30%
Uso: Fundos secundários, separadores, inputs
```

### 4. Vermelho Paixão - `brand-red`
```
Hex: #ED3237
RGB: 237, 50, 55
CMYK: 0, 79, 77, 7%
Uso: Alertas, erros, ações críticas
```

### 5. Turquesa Inovação - `brand-turquoise`
```
Hex: #00F281
RGB: 0, 242, 129
CMYK: 100, 0, 47, 5%
Uso: Status positivo, inovação, elementos modernos
```

### 6. Verde Sustentabilidade - `brand-green`
```
Hex: #5CC6D0
RGB: 92, 198, 208
CMYK: 56, 5, 0, 18%
Uso: Elementos sustentáveis, progresso, sucesso
```

### 7. Amarelo Energia - `brand-yellow`
```
Hex: #F84E4E
RGB: 255, 78, 78
CMYK: 0, 69, 69, 0%
Uso: Aviso, energia, chamadas de atenção
```

### 8. Laranja Criatividade - `brand-orange`
```
Hex: #F58634
RGB: 245, 134, 52
CMYK: 0, 45, 79, 4%
Uso: Elementos criativos, destaques vibrantes
```

---

## 💡 Como Usar as Cores no Código

### Em Templates Vue
```vue
<!-- Texto com cor de marca -->
<h1 class="text-brand-black">Título</h1>
<p class="text-brand-pink">Destaque rosa</p>

<!-- Backgrounds -->
<div class="bg-brand-pink">Fundo rosa</div>
<div class="bg-brand-black">Fundo preto</div>

<!-- Borders -->
<div class="border-brand-pink">Borda rosa</div>

<!-- Hover States -->
<button class="hover:bg-brand-pink">Botão</button>

<!-- Dark Mode -->
<div class="dark:text-brand-pink">Texto rosa em modo escuro</div>
```

### Gradientes
```vue
<!-- Gradientes de marca -->
<div class="bg-gradient-to-r from-brand-pink to-brand-red">
  Gradiente rosa para vermelho
</div>

<div class="bg-gradient-to-br from-brand-black via-brand-pink to-brand-black">
  Gradiente complexo com transição
</div>
```

### Componentes Comuns

#### Botões
```vue
<!-- Primário (Rosa) -->
<button class="bg-brand-pink text-white hover:bg-brand-red">
  Ação Principal
</button>

<!-- Secundário (Cinza) -->
<button class="bg-brand-gray text-brand-black hover:bg-gray-500">
  Ação Secundária
</button>
```

#### Alerts
```vue
<!-- Sucesso (Verde) -->
<div class="bg-brand-green/10 border border-brand-green text-brand-green">
  ✅ Sucesso!
</div>

<!-- Erro (Vermelho) -->
<div class="bg-brand-red/10 border border-brand-red text-brand-red">
  ❌ Erro!
</div>

<!-- Warning (Amarelo) -->
<div class="bg-brand-yellow/10 border border-brand-yellow text-brand-yellow">
  ⚠️ Aviso!
</div>
```

#### Cards
```vue
<div class="bg-white border-l-4 border-brand-pink rounded-lg shadow-lg p-6">
  <h3 class="text-brand-black font-bold">Título</h3>
</div>
```

---

## 🎨 Exemplos Visuais por Página

### Login
- **Background**: Gradiente `from-brand-gray via-brand-pink/10 to-brand-black/10`
- **Logo**: Gradiente `from-brand-pink to-brand-red`
- **Botão**: Gradiente `from-brand-pink to-brand-red`

### Navbar
- **Background**: Gradiente `from-brand-black via-brand-pink to-brand-black`
- **Ativo**: `bg-brand-pink`
- **Hover**: `hover:bg-brand-pink`

### Dashboard
- **Header**: Gradiente `from-brand-pink via-brand-red to-brand-orange`
- **Cards**: Gradientes individuais com cores secundárias
  - Clientes: Pink
  - Produtos: Turquoise
  - Estoque: Green
  - Vendas: Yellow

### Módulos
- **Estoque**: Verde para status OK
- **Produção/Criatividade**: Laranja/Amarelo
- **Alertas**: Vermelho para críticos
- **Sucesso**: Turquesa/Verde

---

## 🌙 Tema Escuro

**Cores se adaptam em modo escuro `dark:`**:

```vue
<!-- Exemplo: Card adaptativo -->
<div class="bg-white dark:bg-gray-800">
  <h3 class="text-brand-black dark:text-white">Título</h3>
  <p class="text-gray-600 dark:text-gray-400">Subtítulo</p>
</div>
```

---

## 📱 Responsividade das Cores

Todas as cores funcionam em:
- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

---

## ✨ Elementos Visuais

### Logo
- Ícone SVG em gradiente `from-brand-pink to-brand-red`
- Wordmark em `brand-black`
- Tagline em `brand-pink`

### Decorações
- Background blobs com opacidade (`.opacity-5`, `.opacity-10`)
- Bordas em cores de marca com opacidade (`.opacity-30`, `.border-opacity-20`)
- Sombras e gradientes para profundidade

### Tipografia
- **Títulos**: `brand-black` ou `text-white` em fundos coloridos
- **Corpo**: `text-gray-600` em claro, `text-gray-400` em escuro
- **Acentos**: `brand-pink`, `brand-turquoise`

---

## 🚀 Como Personalizar Componentes

### Atualizar uma cor existente
Editar em `frontend/tailwind.config.js`:

```javascript
colors: {
  'brand': {
    'black': '#373435',   // Modificar aqui
    'pink': '#FF43A3',
    // ... outros
  }
}
```

### Adicionar nova cor
```javascript
colors: {
  'brand': {
    // ... cores existentes
    'custom': '#XXXXXX',  // Nova cor
  }
}
```

---

## 📊 Checklist de Implementação

- [x] Paleta completa em `tailwind.config.js`
- [x] Logo com cores de marca (`Logo.vue`)
- [x] Navbar com gradientes
- [x] Login redesenhado
- [x] Dashboard com cores por módulo
- [x] Dark mode compatível
- [x] Documentação completa
- [x] Exemplos em todos componentes

---

## 🎯 Próximos Passos

1. **Atualizar páginas restantes** com cores de marca:
   - [ ] Customers
   - [ ] Products
   - [ ] Inventory
   - [ ] Sales
   - [ ] Reports

2. **Adicionar elementos visuais**:
   - [ ] Ícones customizados
   - [ ] Animações com cores da marca
   - [ ] Padrões florais (conforme Brandbook)

3. **Otimizações**:
   - [ ] Acessibilidade de cores (contraste)
   - [ ] Testes visuais em diferentes navegadores
   - [ ] Performance de gradientes

---

## 📞 Suporte

Para adicionar cores ou elementos visuais novos, consulte o Brandbook oficial:
**arquivo:** `BRANDBOOK - MORENA CONCEPT.pdf`

---

**Versão:** 1.2.1  
**Status:** ✅ Cores implementadas em Login, Navbar e Dashboard  
**Próximo:** Expandir para todas as páginas
