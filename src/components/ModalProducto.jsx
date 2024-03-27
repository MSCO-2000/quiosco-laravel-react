import { useState, useEffect } from "react"
import useQuiosco from "../hooks/useQuiosco"
import {formatearDinero} from "../helpers"

export default function ModalProducto() {
  const { producto, handleClickModal, handleAgregarPedido, pedido} = useQuiosco()
  const [cantidad, setCantidad] = useState(1)
  const [edicion, setEdicion] = useState(false)
  
  useEffect(() => {
    // identifica si el producto ya fue agregado al pedido y si es asi extrae los datos del producto 
    // y toma el valor de la cantidad del pedido y la muestra en el modal a través del estado
    if(pedido.some( pedidoState => pedidoState.id === producto.id )){
      const productoEdicion = pedido.filter(pedidoState => pedidoState.id === producto.id)[0]
      
      setCantidad(productoEdicion.cantidad)
      setEdicion(true)
    }
  }, [pedido])
  
  return (
    <div className="md:flex items-center gap-10">
      <div className="md:w-1/3">
        <img 
          alt={`Imagen producto ${producto?.nombre}`}
          src={`/img/${producto?.imagen}.jpg`}
        />
      </div>
      
      <div className="md:w-2/3">
        <div className="flex justify-end absolute top-3 right-3">
          <button
            onClick={() => handleClickModal()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="">
          <h1 className="text-3xl font-bold mt-5">
            {producto?.nombre}
          </h1>
          
          <p className="mt-5 font-black text-5xl text-amber-400">
            {formatearDinero(producto?.precio)}
          </p>
          
          {/* cantidad */}
          <div className="flex gap-4 mt-5">
            <button
              className="cursor-pointer"
              type="button"
              onClick={() => {
                if (cantidad <= 1) return
                setCantidad(cantidad - 1)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </button>
            
              <p className="text-3xl">{cantidad}</p>
            
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => {
                if (cantidad >= 5) return
                setCantidad(cantidad + 1)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </button>
          </div>
        </div>
        
        <button
          type="button"
          className="bg-indigo-600 hover:bg-indigo-800 px-5 py-2 mt-5 text-white
          font-bold uppercase rounded"
          onClick={() => {
            handleAgregarPedido({...producto, cantidad})
            handleClickModal()              
          }}
        >
          {edicion ? 'Guardar Cambios' : 'Añadir al Pedido'}
        </button>
        
      </div>
    </div>
  )
}
