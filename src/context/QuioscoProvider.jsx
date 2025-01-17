import { createContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import clienteAxios from '../config/axios'
import { mutate } from 'swr';

const QuioscoContext = createContext();

const QuioscoProvider = ({children}) => {
  
  const [categorias, setCategorias] = useState([])
  const [categoriaActual, setCategoriaActual] = useState({})
  const [modal, setModal] = useState(false)
  const [producto, setProducto] = useState({})
  const [pedido, setPedido] = useState([])
  const [total, setTotal] = useState(0)
  
  useEffect(() => {
    // tiene dos parametros, total es un acumulado, producto es el elemento sobre el cual está iterando
    // multiplica el precio por la cantidad para obtener el subtotal de cada producto y lo suma al total
    // incrementando en cada iteración
    // se define que el valor de inicio es 0
    const nuevoTotal = pedido.reduce( (total, producto) => (producto.precio * producto.cantidad)
    + total, 0 )
    setTotal(nuevoTotal)
  }, [pedido])
  
  const obtenerCategorias = async () => {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
      const {data} = await clienteAxios('/categorias', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCategorias(data)
      setCategoriaActual(data[0])
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    obtenerCategorias()
  }, [])
  
  const handleClickCategoria = id => {
    const categoria = categorias.filter(categoria => categoria.id === id)[0]

    setCategoriaActual(categoria)
  }
  
  const handleClickModal = () => {
    setModal(!modal)
  }
  
  const handleSetProducto = producto => {
    setProducto(producto)
  }
  
  const handleAgregarPedido = ({categoria_id,...producto}) => {
    if(pedido.some( pedidoState => pedidoState.id === producto.id )){
      // itera sobre los productos en el estado e identifica si el producto ya fue agregado al pedido 
      // y si es asi retorna producto, en caso contrario entonces retorna pedidoState (lo que ya tiene 
      // en memoria)
      const pedidoActualizado = pedido.map(pedidoState => pedidoState.id === producto.id 
        ? producto : pedidoState)
      
      setPedido(pedidoActualizado)
      toast.success('Guardado Correctamente')
    } else {
      setPedido([...pedido, producto])
      toast.success('Agregado al Pedido')
    }
  }
  
  const handleEditarCantidad = id => {
    const productoActualizar = pedido.filter(producto => producto.id === id)[0]
    setProducto(productoActualizar)
    setModal(!modal)
  }
  
  const handleEliminarProductoPedido = id => {
    // obtiene todos los pedidos que sean diferentes al que queremos eliminar y actualiza el estado
    // con estos
    const pedidoActualizado = pedido.filter(producto => producto.id !== id)
    setPedido(pedidoActualizado)
    toast.success('Eliminado del Pedido')
  }
  
  const handleSubmitNuevaOrden = async (logout) => {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
      const {data} = await clienteAxios.post('/pedidos', 
      {
        total,
        productos: pedido.map(producto => {
          return {
            id: producto.id,
            cantidad:producto.cantidad
          }
        }),
      },
      {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      })
      
      toast.success(data.message)
      setTimeout(() => {
        setPedido([])
      }, 1000)
      
      // cerrar la sesión del usuario
      setTimeout(() => {
        localStorage.removeItem('AUTH_TOKEN')
        logout()
      }, 3000)
      
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleClickCompletarPedido = async id => {
    const token = localStorage.getItem('AUTH_TOKEN')
    
    try {
      await clienteAxios.put(`/pedidos/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleClickProductoAgotado = async id => {
    const token = localStorage.getItem('AUTH_TOKEN')
    
    try {
      await clienteAxios.put(`/productos/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <QuioscoContext.Provider
      value={{
        categorias,
        categoriaActual,
        handleClickCategoria,
        modal,
        handleClickModal,
        producto,
        handleSetProducto,
        pedido,
        handleAgregarPedido,
        handleEditarCantidad,
        handleEliminarProductoPedido,
        total,
        handleSubmitNuevaOrden,
        handleClickCompletarPedido,
        handleClickProductoAgotado
      }}
    >
      {children}
    </QuioscoContext.Provider>
  )
}

export {
  QuioscoProvider
}
export default QuioscoContext