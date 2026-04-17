import './App.css'
import './index.css'
import Header from './components/Header'
import ProductCard from './components/productCard'

function App() {
  

  return (
    <>
      <Header></Header> 
      <ProductCard name="Apple Laptop" description="vg gf gwytvc" price="1000" picture="https://picsum.photos/id/1/200/300"></ProductCard>
      <ProductCard name="Gaming Laptop" description="hv dsgiiee  gwvcg " price="2000" picture="https://picsum.photos/id/2/200/300"></ProductCard>
    </>
  )
}

export default App
