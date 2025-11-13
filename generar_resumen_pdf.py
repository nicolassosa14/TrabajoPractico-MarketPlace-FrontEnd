from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch


def escribir_parrafos(c, texto, x, y, ancho_maximo, leading=14):
    palabras = texto.split()
    linea_actual = ""
    for palabra in palabras:
        if c.stringWidth(f"{linea_actual} {palabra}".strip(), "Helvetica", 11) <= ancho_maximo:
            linea_actual = f"{linea_actual} {palabra}".strip()
        else:
            c.drawString(x, y, linea_actual)
            y -= leading
            linea_actual = palabra
    if linea_actual:
        c.drawString(x, y, linea_actual)
        y -= leading
    return y


def escribir_titulo(c, texto, x, y):
    c.setFont("Helvetica-Bold", 16)
    c.drawString(x, y, texto)
    return y - 24


def escribir_subtitulo(c, texto, x, y):
    c.setFont("Helvetica-Bold", 13)
    c.drawString(x, y, texto)
    return y - 20


def preparar_contenido():
    return [
        (
            "CategoriaListView.vue",
            [
                "Carga y muestra un listado de categorías y productos, integrándose con el enrutador para reaccionar a cambios en la categoría seleccionada.",
                "Define estados reactivamente (`categories`, `selectedCategory`, `products`, `loadingProducts`, `errorProducts`) y utiliza composables como `useRoute` y `useCartStore` para manejar la navegación y el carrito.",
                "Incluye funciones asíncronas como `cargarCategorias`, `cargarProductosPorCategoria` y `cargarProductosPorVendor`, que consultan la API y actualizan el estado según la selección del usuario o el local (`vendorId`).",
                "Contiene lógica para ordenar los productos por precio (`productosOrdenados`) mediante una propiedad computada que reordena la lista según la opción elegida (ninguno, ascendente, descendente).",
                "La plantilla ofrece un selector de categoría, un selector de ordenamiento, estados de carga/errores y tarjetas con datos clave del producto, además de botones para agregar al carrito respetando la disponibilidad."
            ]
        ),
        (
            "NavBar.vue",
            [
                "Implementa la barra de navegación principal fija en la parte superior, con enlaces a las secciones clave del sitio y un buscador de locales.",
                "Consume múltiples stores/composables (`useAuthStore`, `useCartStore`, `useGetData`) para obtener el estado de autenticación, cantidad de items en el carrito y rol del usuario.",
                "En `onMounted` se verifica el estado de sesión y se recupera la información del perfil para habilitar accesos condicionales según rol (`isDriver`, `isVendor`, `isAdmin`).",
                "Define acciones como `handleLogout`, `goToRegister` y `buscarLocales`, permitiendo gestionar la salida de sesión, la navegación a registro y una búsqueda por texto normalizada.",
                "La plantilla usa `router-link` y `v-if` para mostrar menús desplegables personalizados según la autenticación, un contador dinámico de carrito y estilos cuidados para hover, gradientes y efectos responsivos."
            ]
        ),
        (
            "MiLocalView.vue",
            [
                "Vista orientada a vendedores que permite consultar datos del local asociado, órdenes y productos publicados.",
                "Utiliza varias instancias del composable `useGetData` para organizar las solicitudes (`getUserData`, `getVendorData`, `getOrders`, `getProducts`) y manejar estados como `loading` y `error`.",
                "En `onMounted` se lee el `userId` desde `localStorage`, se obtiene el perfil del usuario, y si es vendedor, se cargan sus datos específicos utilizando su `vendor_id`.",
                "La plantilla muestra tarjetas con información del local, un acordeón con pedidos (incluyendo fecha, dirección, ítems y totales) y una grilla con los productos del vendedor, mostrando mensajes según el estado de la carga."
            ]
        ),
        (
            "router/index.js",
            [
                "Configura el enrutador de Vue con `createRouter` y `createWebHistory`, declarando las rutas principales de la aplicación.",
                "Cada entrada en `routes` define la ruta, nombre y carga diferida (`import(...)`) de las vistas correspondientes, cubriendo secciones como inicio, login, locales, categorías, pagos, panel de administración, etc.",
                "Incluye rutas parametrizadas como `/local/:vendorId/productos` para detallar productos por local, y rutas específicas para perfiles (`/perfil`), carrito, favoritos, creación de locales/productos y paneles de vendedor/driver.",
                "Sirve como punto único de navegación que conecta las vistas destacadas con el resto del ecosistema del frontend."
            ]
        ),
        (
            "LocalListView.vue",
            [
                "Muestra un catálogo de locales con opción de buscar, ver favoritos y acceder al detalle de productos por local.",
                "Mantiene estados reactivamente (`localItems`, `loading`, `error`, `message`, `favoritesSet`, etc.) y consulta la API para obtener locales, perfil de usuario y favoritos asociados.",
                "Incluye la lógica `toggleFavorite` que sincroniza el estado local con la API para agregar/quitar favoritos, mostrando mensajes de feedback (éxito/error).",
                "Al montar la vista se cargan los datos principales y se lee el parámetro `search` de la URL para inicializar el filtro (`filtro`).",
                "El template despliega una grilla de tarjetas con imagen, descripción y acción para ver productos; además, condiciona botones extras para vendedores que permiten crear locales o productos."
            ]
        ),
        (
            "ProductsByLocalView.vue",
            [
                "Vista que lista productos pertenecientes a un local específico, recibiendo `vendorId` como prop desde el router.",
                "Consulta la API (`api.get('/products/by-vendor/:vendorId')`) para obtener los productos y gestiona estados de carga/errores.",
                "Se integra con `useCartStore` y `useAuthStore` para permitir agregar productos al carrito solo si el usuario está autenticado y el producto está disponible.",
                "La interfaz muestra tarjetas individuales con imagen, precio, descripción y una insignia que señala disponibilidad."
            ]
        ),
        (
            "CategorySection.vue",
            [
                "Componente que presenta una sección destacada de categorías (usado típicamente en la página de inicio).",
                "Carga las categorías desde la API al montarse y regula cuántas se muestran inicialmente (`visibleCategories`) mostrando un botón para ver más.",
                "Permite navegar a la vista de categorías aplicando automáticamente un filtro mediante query params al hacer clic en una tarjeta.",
                "Se enfoca en UX con tarjetas clicables, imágenes, títulos en mayúscula y efectos hover suaves."
            ]
        )
    ]


def main():
    contenido = preparar_contenido()
    archivo_salida = "Resumen_Vistas.pdf"

    c = canvas.Canvas(archivo_salida, pagesize=letter)
    ancho, alto = letter

    margen_x = inch
    margen_y = inch
    ancho_texto = ancho - 2 * margen_x

    y = alto - margen_y

    c.setTitle("Resumen de Vistas - MandaditosApp")

    y = escribir_titulo(c, "Resumen de Vistas - MandaditosApp", margen_x, y)
    c.setFont("Helvetica", 11)
    intro = (
        "Documento de apoyo para exposición oral. Se resumen la estructura y responsabilidades principales "
        "de las vistas y componentes destacados del proyecto frontend."
    )
    y = escribir_parrafos(c, intro, margen_x, y, ancho_texto)
    y -= 10

    for titulo, puntos in contenido:
        if y < margen_y + 100:
            c.showPage()
            y = alto - margen_y
            y = escribir_titulo(c, "Resumen de Vistas - MandaditosApp (cont.)", margen_x, y)
            c.setFont("Helvetica", 11)
            y -= 10

        y = escribir_subtitulo(c, titulo, margen_x, y)
        c.setFont("Helvetica", 11)
        for punto in puntos:
            texto = f"- {punto}"
            if y < margen_y + 50:
                c.showPage()
                y = alto - margen_y
                y = escribir_titulo(c, "Resumen de Vistas - MandaditosApp (cont.)", margen_x, y)
                c.setFont("Helvetica", 11)
                y -= 10
                y = escribir_subtitulo(c, titulo, margen_x, y)
                c.setFont("Helvetica", 11)
            y = escribir_parrafos(c, texto, margen_x + 15, y, ancho_texto - 15)
        y -= 8

    c.save()
    print(f"PDF generado: {archivo_salida}")


if __name__ == "__main__":
    main()

