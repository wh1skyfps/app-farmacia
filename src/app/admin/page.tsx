'use client'

import { useState } from 'react'
import { Lock, LayoutDashboard, Package, FileText, LogOut, Plus, Edit, Trash2, DollarSign, TrendingUp, AlertTriangle, ArrowLeft, Save, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

// Tipos
interface Produto {
  id: string
  nome: string
  preco: number
  estoque: number
  foto: string
  descricao: string
}

interface MetricasDashboard {
  faturamentoMes: number
  topProdutos: { nome: string; vendas: number }[]
  estoquesBaixos: number
}

// Dados mockados
const produtosMock: Produto[] = [
  { id: '1', nome: 'Dipirona 500mg', preco: 12.90, estoque: 150, foto: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', descricao: 'Analgésico e antitérmico' },
  { id: '2', nome: 'Shampoo Anticaspa', preco: 24.90, estoque: 45, foto: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', descricao: 'Tratamento capilar' },
  { id: '3', nome: 'Vitamina C 1000mg', preco: 35.90, estoque: 8, foto: 'https://images.unsplash.com/photo-1550572017-4d93e4e3a96f?w=400', descricao: 'Suplemento vitamínico' },
  { id: '4', nome: 'Protetor Solar FPS 50', preco: 45.90, estoque: 67, foto: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', descricao: 'Proteção solar' },
]

const metricasMock: MetricasDashboard = {
  faturamentoMes: 45780.50,
  topProdutos: [
    { nome: 'Dipirona 500mg', vendas: 234 },
    { nome: 'Vitamina C 1000mg', vendas: 189 },
    { nome: 'Protetor Solar FPS 50', vendas: 156 },
  ],
  estoquesBaixos: 3
}

export default function AdminPanel() {
  const [tela, setTela] = useState<string>('login')
  const [senhaInput, setSenhaInput] = useState<string>('')
  const [produtos, setProdutos] = useState<Produto[]>(produtosMock)
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)
  
  // Estados para adicionar produto
  const [novoProdutoNome, setNovoProdutoNome] = useState<string>('')
  const [novoProdutoPreco, setNovoProdutoPreco] = useState<string>('')
  const [novoProdutoEstoque, setNovoProdutoEstoque] = useState<string>('')
  const [novoProdutoDescricao, setNovoProdutoDescricao] = useState<string>('')
  
  // Estados para editar produto
  const [editPreco, setEditPreco] = useState<string>('')
  const [editEstoque, setEditEstoque] = useState<string>('')

  const SENHA_ADMIN = 'admin123' // Trocar por senha real

  const verificarSenha = () => {
    if (senhaInput === SENHA_ADMIN) {
      setTela('dashboard')
      setSenhaInput('')
    } else {
      setTela('login_fail')
    }
  }

  const adicionarProduto = () => {
    const novoProduto: Produto = {
      id: `${Date.now()}`,
      nome: novoProdutoNome,
      preco: parseFloat(novoProdutoPreco),
      estoque: parseInt(novoProdutoEstoque) || 0,
      foto: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
      descricao: novoProdutoDescricao
    }
    setProdutos([...produtos, novoProduto])
    setNovoProdutoNome('')
    setNovoProdutoPreco('')
    setNovoProdutoEstoque('')
    setNovoProdutoDescricao('')
    setTela('add_product_done')
  }

  const atualizarPreco = () => {
    if (produtoSelecionado) {
      setProdutos(produtos.map(p => 
        p.id === produtoSelecionado.id 
          ? { ...p, preco: parseFloat(editPreco) }
          : p
      ))
      setEditPreco('')
      setTela('edit_done')
    }
  }

  const atualizarEstoque = () => {
    if (produtoSelecionado) {
      setProdutos(produtos.map(p => 
        p.id === produtoSelecionado.id 
          ? { ...p, estoque: parseInt(editEstoque) }
          : p
      ))
      setEditEstoque('')
      setTela('edit_done')
    }
  }

  const removerProduto = () => {
    if (produtoSelecionado) {
      setProdutos(produtos.filter(p => p.id !== produtoSelecionado.id))
      setProdutoSelecionado(null)
      setTela('delete_done')
    }
  }

  // Tela de Login
  if (tela === 'login') {
    return (
      <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#2F4F58] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-[#2F4F58]">Painel Administrativo</CardTitle>
            <CardDescription>Farmácia Dos Municípios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="senha">Senha Administrativa</Label>
              <Input
                id="senha"
                type="password"
                placeholder="Digite a senha"
                value={senhaInput}
                onChange={(e) => setSenhaInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && verificarSenha()}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-[#1E73BE] hover:bg-[#2F4F58]"
              onClick={verificarSenha}
            >
              Acessar Painel
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Tela de Senha Incorreta
  if (tela === 'login_fail') {
    return (
      <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-300">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-red-600">Senha Incorreta</CardTitle>
            <CardDescription>A senha digitada está incorreta. Tente novamente.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="w-full bg-[#1E73BE] hover:bg-[#2F4F58]"
              onClick={() => {
                setTela('login')
                setSenhaInput('')
              }}
            >
              Tentar Novamente
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Dashboard
  if (tela === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#F2F4F6]">
        <header className="bg-[#2F4F58] text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6" />
              <h1 className="text-xl font-bold">Dashboard Administrativo</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTela('login')}
              className="text-white hover:bg-[#1E73BE]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Faturamento do Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">R$ {metricasMock.faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Top Produtos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{metricasMock.topProdutos.length}</p>
                <p className="text-sm opacity-90">produtos em destaque</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Alertas de Estoque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{metricasMock.estoquesBaixos}</p>
                <p className="text-sm opacity-90">produtos com estoque baixo</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Produtos do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metricasMock.topProdutos.map((produto, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-[#1E73BE]">{index + 1}º</Badge>
                      <span className="font-medium">{produto.nome}</span>
                    </div>
                    <span className="text-gray-600">{produto.vendas} vendas</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <Button
              size="lg"
              className="bg-[#1E73BE] hover:bg-[#2F4F58] h-20 text-lg"
              onClick={() => setTela('manage_products')}
            >
              <Package className="w-6 h-6 mr-2" />
              Gerenciar Produtos
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#2F4F58] text-[#2F4F58] hover:bg-gray-100 h-20 text-lg"
              onClick={() => setTela('reports')}
            >
              <FileText className="w-6 h-6 mr-2" />
              Relatórios Detalhados
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50 h-20 text-lg"
              onClick={() => setTela('login')}
            >
              <LogOut className="w-6 h-6 mr-2" />
              Sair do Sistema
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // Gerenciar Produtos
  if (tela === 'manage_products') {
    return (
      <div className="min-h-screen bg-[#F2F4F6]">
        <header className="bg-[#2F4F58] text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTela('dashboard')}
              className="text-white hover:bg-[#1E73BE]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold">Gerenciar Produtos</h1>
            <div className="w-20"></div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 h-16"
              onClick={() => setTela('add_product_name')}
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Produto
            </Button>
            <Button
              size="lg"
              className="bg-[#1E73BE] hover:bg-[#2F4F58] h-16"
              onClick={() => setTela('select_product_edit')}
            >
              <Edit className="w-5 h-5 mr-2" />
              Editar Produto
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#2F4F58] text-[#2F4F58] h-16"
              onClick={() => setTela('dashboard')}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar ao Dashboard
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Produtos</CardTitle>
              <CardDescription>Total: {produtos.length} produtos cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {produtos.map(produto => (
                  <div key={produto.id} className="flex items-center gap-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                    <img src={produto.foto} alt={produto.nome} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-bold">{produto.nome}</h3>
                      <p className="text-sm text-gray-600">{produto.descricao}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1E73BE]">R$ {produto.preco.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Estoque: {produto.estoque}</p>
                      {produto.estoque < 10 && (
                        <Badge variant="destructive" className="mt-1">Baixo</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Adicionar Produto - Nome
  if (tela === 'add_product_name') {
    return (
      <div className="min-h-screen bg-[#F2F4F6]">
        <header className="bg-[#2F4F58] text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTela('manage_products')}
              className="text-white hover:bg-[#1E73BE]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold">Adicionar Produto</h1>
            <div className="w-20"></div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto p-4 sm:p-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Produto</CardTitle>
              <CardDescription>Preencha todos os campos para adicionar um novo produto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Dipirona 500mg"
                  value={novoProdutoNome}
                  onChange={(e) => setNovoProdutoNome(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descrição do produto"
                  value={novoProdutoDescricao}
                  onChange={(e) => setNovoProdutoDescricao(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={novoProdutoPreco}
                  onChange={(e) => setNovoProdutoPreco(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estoque">Quantidade em Estoque</Label>
                <Input
                  id="estoque"
                  type="number"
                  placeholder="0"
                  value={novoProdutoEstoque}
                  onChange={(e) => setNovoProdutoEstoque(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={adicionarProduto}
                disabled={!novoProdutoNome || !novoProdutoPreco}
              >
                <Save className="w-4 h-4 mr-2" />
                Criar Produto
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    )
  }

  // Produto Criado
  if (tela === 'add_product_done') {
    return (
      <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl text-green-600">Produto Criado!</CardTitle>
            <CardDescription>O produto foi adicionado com sucesso ao catálogo</CardDescription>
          </CardHeader>
          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setTela('add_product_name')}
            >
              Adicionar Outro
            </Button>
            <Button
              className="flex-1 bg-[#1E73BE] hover:bg-[#2F4F58]"
              onClick={() => setTela('manage_products')}
            >
              Voltar
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Selecionar Produto para Editar
  if (tela === 'select_product_edit') {
    return (
      <div className="min-h-screen bg-[#F2F4F6]">
        <header className="bg-[#2F4F58] text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTela('manage_products')}
              className="text-white hover:bg-[#1E73BE]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold">Selecionar Produto</h1>
            <div className="w-20"></div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Escolha o produto para editar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {produtos.map(produto => (
                  <div
                    key={produto.id}
                    className="flex items-center gap-4 p-4 bg-white border rounded-lg hover:shadow-md hover:border-[#1E73BE] transition-all cursor-pointer"
                    onClick={() => {
                      setProdutoSelecionado(produto)
                      setTela('edit_product_menu')
                    }}
                  >
                    <img src={produto.foto} alt={produto.nome} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-bold">{produto.nome}</h3>
                      <p className="text-sm text-gray-600">{produto.descricao}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1E73BE]">R$ {produto.preco.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Estoque: {produto.estoque}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Menu de Edição do Produto
  if (tela === 'edit_product_menu' && produtoSelecionado) {
    return (
      <div className="min-h-screen bg-[#F2F4F6]">
        <header className="bg-[#2F4F58] text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTela('select_product_edit')}
              className="text-white hover:bg-[#1E73BE]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold">Editar Produto</h1>
            <div className="w-20"></div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{produtoSelecionado.nome}</CardTitle>
              <CardDescription>O que deseja alterar?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                <img src={produtoSelecionado.foto} alt={produtoSelecionado.nome} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-bold text-lg">{produtoSelecionado.nome}</p>
                  <p className="text-gray-600">{produtoSelecionado.descricao}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-[#1E73BE] font-bold">R$ {produtoSelecionado.preco.toFixed(2)}</span>
                    <span className="text-gray-600">Estoque: {produtoSelecionado.estoque}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                className="w-full bg-[#1E73BE] hover:bg-[#2F4F58]"
                onClick={() => {
                  setEditPreco(produtoSelecionado.preco.toString())
                  setTela('edit_price')
                }}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Alterar Preço
              </Button>
              <Button
                className="w-full bg-[#1E73BE] hover:bg-[#2F4F58]"
                onClick={() => {
                  setEditEstoque(produtoSelecionado.estoque.toString())
                  setTela('edit_stock')
                }}
              >
                <Package className="w-4 h-4 mr-2" />
                Alterar Estoque
              </Button>
              <Button
                className="w-full bg-[#1E73BE] hover:bg-[#2F4F58]"
                onClick={() => setTela('edit_photo')}
              >
                <Upload className="w-4 h-4 mr-2" />
                Alterar Foto
              </Button>
              <Separator className="my-2" />
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setTela('delete_product')}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remover Produto
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    )
  }

  // Editar Preço
  if (tela === 'edit_price' && produtoSelecionado) {
    return (
      <div className="min-h-screen bg-[#F2F4F6]">
        <header className="bg-[#2F4F58] text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTela('edit_product_menu')}
              className="text-white hover:bg-[#1E73BE]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold">Alterar Preço</h1>
            <div className="w-20"></div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto p-4 sm:p-6">
          <Card>
            <CardHeader>
              <CardTitle>{produtoSelecionado.nome}</CardTitle>
              <CardDescription>Preço atual: R$ {produtoSelecionado.preco.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="novo-preco">Novo Preço (R$)</Label>
                <Input
                  id="novo-preco"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={editPreco}
                  onChange={(e) => setEditPreco(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={atualizarPreco}
                disabled={!editPreco}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Alteração
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    )
  }

  // Editar Estoque
  if (tela === 'edit_stock' && produtoSelecionado) {
    return (
      <div className="min-h-screen bg-[#F2F4F6]">
        <header className="bg-[#2F4F58] text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTela('edit_product_menu')}
              className="text-white hover:bg-[#1E73BE]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold">Alterar Estoque</h1>
            <div className="w-20"></div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto p-4 sm:p-6">
          <Card>
            <CardHeader>
              <CardTitle>{produtoSelecionado.nome}</CardTitle>
              <CardDescription>Estoque atual: {produtoSelecionado.estoque} unidades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="novo-estoque">Nova Quantidade em Estoque</Label>
                <Input
                  id="novo-estoque"
                  type="number"
                  placeholder="0"
                  value={editEstoque}
                  onChange={(e) => setEditEstoque(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={atualizarEstoque}
                disabled={!editEstoque}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Alteração
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    )
  }

  // Editar Foto
  if (tela === 'edit_photo' && produtoSelecionado) {
    return (
      <div className="min-h-screen bg-[#F2F4F6]">
        <header className="bg-[#2F4F58] text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTela('edit_product_menu')}
              className="text-white hover:bg-[#1E73BE]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold">Alterar Foto</h1>
            <div className="w-20"></div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto p-4 sm:p-6">
          <Card>
            <CardHeader>
              <CardTitle>{produtoSelecionado.nome}</CardTitle>
              <CardDescription>Foto atual do produto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <img src={produtoSelecionado.foto} alt={produtoSelecionado.nome} className="w-full h-64 object-cover rounded-lg" />
              <div className="space-y-2">
                <Label htmlFor="nova-foto">Upload de Nova Foto</Label>
                <Input
                  id="nova-foto"
                  type="file"
                  accept="image/*"
                />
              </div>
              <p className="text-sm text-gray-600">
                Nota: Esta é uma demonstração. Em produção, a foto seria enviada para o servidor.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setTela('edit_done')}
              >
                <Upload className="w-4 h-4 mr-2" />
                Enviar Foto
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    )
  }

  // Confirmação de Remoção
  if (tela === 'delete_product' && produtoSelecionado) {
    return (
      <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-300">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-red-600">Confirmar Remoção</CardTitle>
            <CardDescription>
              Tem certeza que deseja remover o produto "{produtoSelecionado.nome}"? Esta ação não pode ser desfeita.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setTela('edit_product_menu')}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={removerProduto}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remover
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Produto Removido
  if (tela === 'delete_done') {
    return (
      <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl text-green-600">Produto Removido</CardTitle>
            <CardDescription>O produto foi removido com sucesso do catálogo</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className="w-full bg-[#1E73BE] hover:bg-[#2F4F58]"
              onClick={() => setTela('manage_products')}
            >
              Voltar ao Gerenciamento
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Alteração Realizada
  if (tela === 'edit_done') {
    return (
      <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl text-green-600">Alteração Salva!</CardTitle>
            <CardDescription>As alterações foram salvas com sucesso</CardDescription>
          </CardHeader>
          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setTela('manage_products')}
            >
              Gerenciamento
            </Button>
            <Button
              className="flex-1 bg-[#1E73BE] hover:bg-[#2F4F58]"
              onClick={() => setTela('dashboard')}
            >
              Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Relatórios
  if (tela === 'reports') {
    return (
      <div className="min-h-screen bg-[#F2F4F6]">
        <header className="bg-[#2F4F58] text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTela('dashboard')}
              className="text-white hover:bg-[#1E73BE]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold">Relatórios Detalhados</h1>
            <div className="w-20"></div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendas do Mês</CardTitle>
              <CardDescription>Relatório completo de vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-semibold">Faturamento Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    R$ {metricasMock.faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="font-semibold">Produtos Vendidos</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {metricasMock.topProdutos.reduce((acc, p) => acc + p.vendas, 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Produtos</CardTitle>
              <CardDescription>Produtos mais vendidos do período</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metricasMock.topProdutos.map((produto, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-[#1E73BE]">{index + 1}º</Badge>
                      <span className="font-medium">{produto.nome}</span>
                    </div>
                    <span className="font-bold text-[#1E73BE]">{produto.vendas} vendas</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alertas de Estoque Baixo</CardTitle>
              <CardDescription>Produtos que precisam de reposição</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {produtos.filter(p => p.estoque < 10).map(produto => (
                  <div key={produto.id} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <span className="font-medium">{produto.nome}</span>
                    </div>
                    <Badge variant="destructive">Estoque: {produto.estoque}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full bg-[#1E73BE] hover:bg-[#2F4F58]"
            onClick={() => setTela('dashboard')}
          >
            Voltar ao Dashboard
          </Button>
        </main>
      </div>
    )
  }

  return null
}
