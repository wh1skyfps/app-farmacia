'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Search, Package, ArrowLeft, Plus, Minus, Trash2, CreditCard, QrCode, Banknote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

// Tipos
interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  posologia?: string
  foto: string
  categoria: string
}

interface Categoria {
  id: string
  nome: string
}

interface ItemCarrinho {
  produto: Produto
  quantidade: number
}

interface Promocao {
  id: string
  produto: Produto
  desconto: number
}

// Dados mockados
const categoriasMock: Categoria[] = [
  { id: '1', nome: 'Medicamentos' },
  { id: '2', nome: 'Higiene' },
  { id: '3', nome: 'Beleza' },
  { id: '4', nome: 'Vitaminas' },
]

const produtosMock: Produto[] = [
  {
    id: '1',
    nome: 'Dipirona 500mg',
    descricao: 'Analgésico e antitérmico',
    preco: 12.90,
    posologia: 'Tomar 1 comprimido a cada 6 horas',
    foto: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
    categoria: '1'
  },
  {
    id: '2',
    nome: 'Shampoo Anticaspa',
    descricao: 'Shampoo para tratamento de caspa',
    preco: 24.90,
    foto: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
    categoria: '2'
  },
  {
    id: '3',
    nome: 'Vitamina C 1000mg',
    descricao: 'Suplemento vitamínico',
    preco: 35.90,
    posologia: 'Tomar 1 cápsula ao dia',
    foto: 'https://images.unsplash.com/photo-1550572017-4d93e4e3a96f?w=400&h=400&fit=crop',
    categoria: '4'
  },
  {
    id: '4',
    nome: 'Protetor Solar FPS 50',
    descricao: 'Proteção solar alta',
    preco: 45.90,
    foto: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    categoria: '3'
  },
  {
    id: '5',
    nome: 'Paracetamol 750mg',
    descricao: 'Analgésico e antitérmico',
    preco: 15.90,
    posologia: 'Tomar 1 comprimido a cada 8 horas',
    foto: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop',
    categoria: '1'
  },
  {
    id: '6',
    nome: 'Creme Hidratante',
    descricao: 'Hidratação profunda',
    preco: 29.90,
    foto: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
    categoria: '3'
  },
]

const promocoesMock: Promocao[] = [
  { id: '1', produto: produtosMock[0], desconto: 20 },
  { id: '2', produto: produtosMock[2], desconto: 15 },
]

export default function FarmaciaApp() {
  const [tela, setTela] = useState<string>('home')
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [categoriaAtual, setCategoriaAtual] = useState<string>('')
  const [produtoAtual, setProdutoAtual] = useState<Produto | null>(null)
  const [buscaQuery, setBuscaQuery] = useState<string>('')
  const [endereco, setEndereco] = useState<string>('')
  const [metodoPagamento, setMetodoPagamento] = useState<string>('')
  const [pedidoId, setPedidoId] = useState<string>('')

  const totalCarrinho = carrinho.reduce((acc, item) => acc + (item.produto.preco * item.quantidade), 0)
  const quantidadeItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0)

  const adicionarAoCarrinho = (produto: Produto) => {
    const itemExistente = carrinho.find(item => item.produto.id === produto.id)
    if (itemExistente) {
      setCarrinho(carrinho.map(item =>
        item.produto.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ))
    } else {
      setCarrinho([...carrinho, { produto, quantidade: 1 }])
    }
  }

  const removerDoCarrinho = (produtoId: string) => {
    setCarrinho(carrinho.filter(item => item.produto.id !== produtoId))
  }

  const alterarQuantidade = (produtoId: string, delta: number) => {
    setCarrinho(carrinho.map(item => {
      if (item.produto.id === produtoId) {
        const novaQuantidade = item.quantidade + delta
        return novaQuantidade > 0 ? { ...item, quantidade: novaQuantidade } : item
      }
      return item
    }).filter(item => item.quantidade > 0))
  }

  const finalizarPedido = () => {
    const novoId = `PED${Math.floor(Math.random() * 10000)}`
    setPedidoId(novoId)
    setCarrinho([])
    setTela('order_confirmation')
  }

  const produtosFiltrados = buscaQuery
    ? produtosMock.filter(p => p.nome.toLowerCase().includes(buscaQuery.toLowerCase()))
    : []

  const produtosPorCategoria = categoriaAtual
    ? produtosMock.filter(p => p.categoria === categoriaAtual)
    : []

  // Tela Inicial - Promoções
  if (tela === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="bg-[#1E73BE] text-white p-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/560a4442-3de9-42f4-84a2-3f0eca37bd4f.png" 
                alt="Farmácia Dos Municípios" 
                className="h-12 w-auto"
              />
              <h1 className="text-2xl font-bold">Farmácia Dos Municípios</h1>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setTela('cart')}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {quantidadeItens > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                  {quantidadeItens}
                </Badge>
              )}
            </Button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
          <div className="text-center py-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo(a)!</h2>
            <p className="text-lg text-gray-600">Veja as promoções do dia</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promocoesMock.map(promo => (
              <Card key={promo.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onClick={() => {
                setProdutoAtual(promo.produto)
                setTela('product_detail')
              }}>
                <div className="relative">
                  <img src={promo.produto.foto} alt={promo.produto.nome} className="w-full h-48 object-cover" />
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white text-lg">
                    -{promo.desconto}%
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{promo.produto.nome}</CardTitle>
                  <CardDescription>{promo.produto.descricao}</CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 line-through">R$ {promo.produto.preco.toFixed(2)}</p>
                    <p className="text-2xl font-bold text-[#1E73BE]">
                      R$ {(promo.produto.preco * (1 - promo.desconto / 100)).toFixed(2)}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Button
              size="lg"
              className="bg-[#1E73BE] hover:bg-[#0B66A3] text-white h-20 text-lg"
              onClick={() => setTela('categories')}
            >
              <Package className="w-6 h-6 mr-2" />
              Ver Categorias
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#1E73BE] text-[#1E73BE] hover:bg-blue-50 h-20 text-lg"
              onClick={() => setTela('search')}
            >
              <Search className="w-6 h-6 mr-2" />
              Buscar Produto
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#1E73BE] text-[#1E73BE] hover:bg-blue-50 h-20 text-lg"
              onClick={() => setTela('cart')}
            >
              <ShoppingCart className="w-6 h-6 mr-2" />
              Ver Carrinho
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // Tela de Categorias
  if (tela === 'categories') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="bg-[#1E73BE] text-white p-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setTela('home')} className="text-white hover:bg-blue-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold">Categorias</h1>
            <Button variant="secondary" size="sm" onClick={() => setTela('cart')} className="relative">
              <ShoppingCart className="w-5 h-5" />
              {quantidadeItens > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">{quantidadeItens}</Badge>
              )}
            </Button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">Escolha a categoria</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoriasMock.map(cat => (
              <Card
                key={cat.id}
                className="hover:shadow-xl transition-shadow cursor-pointer hover:border-[#1E73BE]"
                onClick={() => {
                  setCategoriaAtual(cat.id)
                  setTela('category_list')
                }}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{cat.nome}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </main>
      </div>
    )
  }

  // Tela de Produtos por Categoria
  if (tela === 'category_list') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="bg-[#1E73BE] text-white p-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setTela('categories')} className="text-white hover:bg-blue-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold">Produtos</h1>
            <Button variant="secondary" size="sm" onClick={() => setTela('cart')} className="relative">
              <ShoppingCart className="w-5 h-5" />
              {quantidadeItens > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">{quantidadeItens}</Badge>
              )}
            </Button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            {categoriasMock.find(c => c.id === categoriaAtual)?.nome}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {produtosPorCategoria.map(produto => (
              <Card
                key={produto.id}
                className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => {
                  setProdutoAtual(produto)
                  setTela('product_detail')
                }}
              >
                <img src={produto.foto} alt={produto.nome} className="w-full h-48 object-cover" />
                <CardHeader>
                  <CardTitle className="text-lg">{produto.nome}</CardTitle>
                  <CardDescription>{produto.descricao}</CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-[#1E73BE]">R$ {produto.preco.toFixed(2)}</p>
                  <Button
                    size="sm"
                    className="bg-[#1E73BE] hover:bg-[#0B66A3]"
                    onClick={(e) => {
                      e.stopPropagation()
                      adicionarAoCarrinho(produto)
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>
    )
  }

  // Tela de Detalhes do Produto
  if (tela === 'product_detail' && produtoAtual) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="bg-[#1E73BE] text-white p-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setTela('category_list')} className="text-white hover:bg-blue-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold">Detalhes</h1>
            <Button variant="secondary" size="sm" onClick={() => setTela('cart')} className="relative">
              <ShoppingCart className="w-5 h-5" />
              {quantidadeItens > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">{quantidadeItens}</Badge>
              )}
            </Button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 sm:p-6">
          <Card className="overflow-hidden">
            <img src={produtoAtual.foto} alt={produtoAtual.nome} className="w-full h-64 sm:h-96 object-cover" />
            <CardHeader>
              <CardTitle className="text-3xl">{produtoAtual.nome}</CardTitle>
              <CardDescription className="text-lg">{produtoAtual.descricao}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {produtoAtual.posologia && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Posologia:</h3>
                  <p className="text-gray-600">{produtoAtual.posologia}</p>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-4xl font-bold text-[#1E73BE]">R$ {produtoAtual.preco.toFixed(2)}</p>
              </div>
            </CardContent>
            <CardFooter className="gap-4">
              <Button
                size="lg"
                className="flex-1 bg-[#1E73BE] hover:bg-[#0B66A3] text-lg"
                onClick={() => {
                  adicionarAoCarrinho(produtoAtual)
                  setTela('cart')
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    )
  }

  // Tela de Busca
  if (tela === 'search') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="bg-[#1E73BE] text-white p-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setTela('home')} className="text-white hover:bg-blue-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold">Buscar Produto</h1>
            <Button variant="secondary" size="sm" onClick={() => setTela('cart')} className="relative">
              <ShoppingCart className="w-5 h-5" />
              {quantidadeItens > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">{quantidadeItens}</Badge>
              )}
            </Button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
          <div className="flex gap-2">
            <Input
              placeholder="Digite o nome do produto..."
              value={buscaQuery}
              onChange={(e) => setBuscaQuery(e.target.value)}
              className="text-lg"
            />
            <Button className="bg-[#1E73BE] hover:bg-[#0B66A3]">
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {buscaQuery && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Resultados da busca</h2>
              {produtosFiltrados.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {produtosFiltrados.map(produto => (
                    <Card
                      key={produto.id}
                      className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => {
                        setProdutoAtual(produto)
                        setTela('product_detail')
                      }}
                    >
                      <img src={produto.foto} alt={produto.nome} className="w-full h-48 object-cover" />
                      <CardHeader>
                        <CardTitle className="text-lg">{produto.nome}</CardTitle>
                        <CardDescription>{produto.descricao}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-[#1E73BE]">R$ {produto.preco.toFixed(2)}</p>
                        <Button
                          size="sm"
                          className="bg-[#1E73BE] hover:bg-[#0B66A3]"
                          onClick={(e) => {
                            e.stopPropagation()
                            adicionarAoCarrinho(produto)
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Nenhum produto encontrado</p>
              )}
            </div>
          )}
        </main>
      </div>
    )
  }

  // Tela do Carrinho
  if (tela === 'cart') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="bg-[#1E73BE] text-white p-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setTela('home')} className="text-white hover:bg-blue-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold">Carrinho</h1>
            <div className="w-20"></div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
          {carrinho.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 mb-4">Seu carrinho está vazio</p>
                <Button onClick={() => setTela('home')} className="bg-[#1E73BE] hover:bg-[#0B66A3]">
                  Continuar Comprando
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {carrinho.map(item => (
                  <Card key={item.produto.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img src={item.produto.foto} alt={item.produto.nome} className="w-24 h-24 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{item.produto.nome}</h3>
                          <p className="text-gray-600">{item.produto.descricao}</p>
                          <p className="text-xl font-bold text-[#1E73BE] mt-2">R$ {item.produto.preco.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removerDoCarrinho(item.produto.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => alterarQuantidade(item.produto.id, -1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-bold w-8 text-center">{item.quantidade}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => alterarQuantidade(item.produto.id, 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg">Subtotal:</span>
                    <span className="text-2xl font-bold text-[#1E73BE]">R$ {totalCarrinho.toFixed(2)}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setTela('home')}
                    >
                      Continuar Comprando
                    </Button>
                    <Button
                      className="flex-1 bg-[#1E73BE] hover:bg-[#0B66A3] text-lg"
                      onClick={() => setTela('checkout')}
                    >
                      Finalizar Compra
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    )
  }

  // Tela de Checkout
  if (tela === 'checkout') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="bg-[#1E73BE] text-white p-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setTela('cart')} className="text-white hover:bg-blue-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold">Checkout</h1>
            <div className="w-20"></div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Endereço de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Digite seu endereço ou escreva 'Retirada'"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="text-lg"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forma de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={metodoPagamento} onValueChange={setMetodoPagamento}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-blue-50 cursor-pointer">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                    <QrCode className="w-5 h-5 text-[#1E73BE]" />
                    <span className="text-lg">PIX no app</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-blue-50 cursor-pointer">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="w-5 h-5 text-[#1E73BE]" />
                    <span className="text-lg">Cartão no app</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-blue-50 cursor-pointer">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Banknote className="w-5 h-5 text-[#1E73BE]" />
                    <span className="text-lg">Pagar na entrega/retirada</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="bg-blue-50">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-3xl font-bold text-[#1E73BE]">R$ {totalCarrinho.toFixed(2)}</span>
              </div>
              <Button
                size="lg"
                className="w-full bg-[#1E73BE] hover:bg-[#0B66A3] text-lg"
                disabled={!endereco || !metodoPagamento}
                onClick={finalizarPedido}
              >
                Confirmar Pedido
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Tela de Confirmação do Pedido
  if (tela === 'order_confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-3xl text-green-600">Pedido Confirmado!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-xl">Pedido ID: <span className="font-bold text-[#1E73BE]">{pedidoId}</span></p>
            <p className="text-lg text-gray-600">Forma de pagamento: {
              metodoPagamento === 'pix' ? 'PIX' :
              metodoPagamento === 'card' ? 'Cartão' :
              'Pagar na entrega/retirada'
            }</p>
            <p className="text-lg text-gray-600">Endereço: {endereco}</p>
            <Separator className="my-4" />
            <p className="text-2xl font-bold text-[#1E73BE]">Total: R$ {totalCarrinho.toFixed(2)}</p>
            <p className="text-gray-600 mt-4">Obrigado pela sua compra!</p>
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              className="w-full bg-[#1E73BE] hover:bg-[#0B66A3]"
              onClick={() => {
                setTela('home')
                setEndereco('')
                setMetodoPagamento('')
              }}
            >
              Voltar ao Início
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return null
}
