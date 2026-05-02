import React, { useEffect, useMemo, useState } from "react";

// ✅ VERSIÓN ULTRA SIMPLE (SIN SUPABASE)
// Todo se guarda en tu navegador
// Funciona inmediatamente en Vercel sin configuraciones

const STORAGE_KEY = "catalogo-simple";

const categorias = ["Todas", "Sala", "Comedor", "Cuarto", "Oficina", "Decoración", "Otros"];

const imagenDefault =
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1400&auto=format&fit=crop";

function Boton({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-xl bg-black text-white text-sm ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function App() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    categoria: "Sala",
    descripcion: "",
    imagen: "",
  });

  // cargar datos
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) setProductos(JSON.parse(data));
  }, []);

  // guardar datos
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
  }, [productos]);

  const filtrados = useMemo(() => {
    return productos.filter((p) => {
      const matchTexto = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const matchCat = categoria === "Todas" || p.categoria === categoria;
      return matchTexto && matchCat;
    });
  }, [productos, busqueda, categoria]);

  function agregar(e) {
    e.preventDefault();
    if (!form.nombre || !form.precio) return alert("Completa nombre y precio");

    setProductos([
      {
        ...form,
        id: Date.now(),
        imagen: form.imagen || imagenDefault,
      },
      ...productos,
    ]);

    setForm({ nombre: "", precio: "", categoria: "Sala", descripcion: "", imagen: "" });
  }

  function eliminar(id) {
    setProductos(productos.filter((p) => p.id !== id));
  }

  function copiarLink() {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copiado");
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Catálogo de venta</h1>

      <div className="mb-4 flex gap-2">
        <input
          placeholder="Buscar"
          className="border p-2 flex-1"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          {categorias.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <Boton onClick={copiarLink}>Copiar link</Boton>
      </div>

      <form onSubmit={agregar} className="mb-6 space-y-2">
        <input
          placeholder="Nombre"
          className="border p-2 w-full"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
        <input
          placeholder="Precio"
          type="number"
          className="border p-2 w-full"
          value={form.precio}
          onChange={(e) => setForm({ ...form, precio: e.target.value })}
        />
        <input
          placeholder="Imagen URL"
          className="border p-2 w-full"
          value={form.imagen}
          onChange={(e) => setForm({ ...form, imagen: e.target.value })}
        />
        <textarea
          placeholder="Descripción"
          className="border p-2 w-full"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
        />
        <Boton type="submit">Agregar</Boton>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        {filtrados.map((p) => (
          <div key={p.id} className="border p-3">
            <img src={p.imagen} className="h-40 w-full object-cover" />
            <h3 className="font-bold mt-2">{p.nombre}</h3>
            <p>${p.precio}</p>
            <p className="text-sm">{p.descripcion}</p>
            <button
              onClick={() => eliminar(p.id)}
              className="text-red-500 mt-2"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
