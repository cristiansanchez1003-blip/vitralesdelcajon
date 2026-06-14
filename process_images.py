import os
import hashlib
from PIL import Image

# Directories
vitrales_dir = 'Fotos vitrales'
collection_dir = 'assets/images/collection'

if not os.path.exists(collection_dir):
    os.makedirs(collection_dir)

# Helper to hash files to find unique ones
def get_unique_files(folder):
    unique = []
    seen = set()
    for f in sorted(os.listdir(folder)):
        path = os.path.join(folder, f)
        if os.path.isdir(path) or not f.lower().endswith(('.jpg', '.jpeg')):
            continue
        with open(path, 'rb') as file_to_hash:
            data = file_to_hash.read()
            md5 = hashlib.md5(data).hexdigest()
        if md5 not in seen:
            seen.add(md5)
            unique.append((path, f))
    return unique

unique_items = get_unique_files(vitrales_dir)
print(f"Found {len(unique_items)} unique images to process.")

# Generador de nombres SEO y descripciones poéticas para 86 piezas
nombres_seo = [
    "Vitral Sol de la Cordillera", "Atrapasol Colibrí Andino", "Vitral Geometría Sagrada", "Lámpara Tiffany Amanecer",
    "Panel Vitral Flor del Cajón", "Espejo Vitral Bosque Nativo", "Vitral Mandala de Luz", "Atrapasol Mariposa del Maipo",
    "Vitral Cúspide de la Montaña", "Panel Vitral Río Maipo", "Vitral Eclipse del Valle", "Atrapasol Pluma Luminosa",
    "Vitral Ojo de la Tierra", "Lámpara Tiffany Ocaso de Cobre", "Panel Vitral Geometría Andina", "Espejo Vitral Hojas de Plata",
    "Vitral Chacana del Cajón", "Atrapasol Gotas de Lluvia", "Vitral Espiral del Tiempo", "Panel Vitral Hojas de Roble",
    "Vitral Trío de Cactus", "Atrapasol Luna y Estrellas", "Vitral Ventana Andina", "Lámpara Tiffany Hojas del Bosque",
    "Panel Vitral Mandala Cósmico", "Espejo Vitral Diseño Colonial", "Vitral Portal de los Andes", "Atrapasol Estrella del Maipo",
    "Vitral Calma Cordillerana", "Panel Vitral Atardecer de Fuego", "Vitral Prismas del Sol", "Atrapasol Hoja de Parra",
    "Vitral Ojo Andino", "Lámpara Tiffany Libélula de Oro", "Panel Vitral Cascada de Luz", "Espejo Vitral Rosetón Clásico",
    "Vitral Equilibrio de Luz", "Atrapasol Flor de Cactus", "Vitral Montaña Sagrada", "Panel Vitral Luz de la Luna",
    "Vitral Cuarzo del Cajón", "Atrapasol Pluma Iridiscente", "Vitral Escultura del Viento", "Lámpara Tiffany Peumo Dorado",
    "Panel Vitral Geometría del Valle", "Espejo Vitral Bordes Biselados", "Vitral Flor de Loto", "Atrapasol Mandala Pequeño",
    "Vitral Reflejos del Maipo", "Panel Vitral Fuego Andino", "Vitral Portal de la Luz", "Atrapasol Hoja de Canelo",
    "Vitral Sol Naciente", "Lámpara Tiffany Rosas Silvestres", "Panel Vitral Estructura Cubista", "Espejo Vitral Vitromosaico",
    "Vitral Bosque de Cobre", "Atrapasol Libélula Turquesa", "Vitral Olas del Maipo", "Panel Vitral Constelación",
    "Vitral Girasol Luminoso", "Atrapasol Prismático", "Vitral Trilogía Cordillerana", "Lámpara Tiffany Violetas del Valle",
    "Panel Vitral Espacio Sagrado", "Espejo Vitral Hojas de Lenga", "Vitral Destello Andino", "Atrapasol Colibrí de Fuego",
    "Vitral Armonía Geométrica", "Panel Vitral Bosque de Arrayanes", "Vitral Rayos de Cobre", "Atrapasol Luna de Cristal",
    "Vitral Ojo del Maipo", "Lámpara Tiffany Hojas de Otoño", "Panel Vitral Silueta Cordillerana", "Espejo Vitral Tradicional",
    "Vitral Espíritu del Cajón", "Atrapasol Estrella Fugaz", "Vitral Simetría Sagrada", "Panel Vitral Luz de Invierno",
    "Vitral Ocaso del Maipo", "Lámpara Tiffany Diseño Geométrico", "Panel Vitral Cascada Esmeralda", "Espejo Vitral Flores Azules",
    "Vitral Cordillera y Sol", "Atrapasol Gota de Rocío"
]

descripciones_poeticas = [
    "Una obra que captura el sol radiante sobre las cumbres, llenando la habitación de reflejos cálidos y dorados.",
    "Delicado atrapasol que recrea el vuelo de un colibrí, diseñado para colgar cerca de ventanas y activar la luz.",
    "Composición geométrica perfecta inspirada en patrones sagrados, ideal para meditación y armonizar espacios.",
    "Pantalla de lámpara estilo Tiffany con tonos cálidos que emula la luz suave del amanecer andino.",
    "Delicada pieza inspirada en la flora endémica del Cajón, con texturas que enriquecen el paso de la luz.",
    "Espejo enmarcado con piezas de vidrio en tonos tierra y ocre, simulando la fronda de un bosque nativo.",
    "Mandala circular de vitral con un centro iridiscente que proyecta destellos multicolores en todas direcciones.",
    "Mariposa de vitral en tonos anaranjados y turquesas, ideal para dar vida y color a cualquier balcón o ventana.",
    "Representación abstracta del macizo andino, una pieza con carácter y gran fuerza visual.",
    "Panel alargado que evoca las curvas y la fuerza del río Maipo fluyendo a través del valle.",
    "Obra circular de colección con contraste entre vidrios opacos y translúcidos, simulando un eclipse.",
    "Pequeño atrapasol en forma de pluma con vidrios texturados que filtran la luz con gran suavidad.",
    "Vitral escultórico inspirado en la conexión con la naturaleza y los elementos de la tierra.",
    "Lámpara Tiffany de tonos rojizos y cobre, que crea una atmósfera íntima y acogedora en el hogar.",
    "Panel de ventana con diseño lineal y abstracto que dialoga armónicamente con la arquitectura moderna.",
    "Espejo decorado con hojas de vidrio plateado y translúcido que capturan reflejos sutiles.",
    "La chakana o cruz andina representada en vitral emplomado, cargada de simbolismo y tradición.",
    "Atrapasol colgante con múltiples prismas que descomponen la luz solar en el espectro del arcoíris.",
    "Diseño dinámico en espiral que crea sensación de movimiento a medida que la luz cambia durante el día.",
    "Vitral con detalles de hojas de roble, una pieza rústica ideal para casas de montaña.",
    "Composición tridimensional de tres cactus en vitral verde sobre base de madera de autor.",
    "Medallón colgante que reúne la luna y estrellas en una composición nocturna de tonos púrpuras y azules.",
    "Ventana de vitral de gran formato, ideal para ser instalada en accesos o muros de luz.",
    "Lámpara de mesa Tiffany inspirada en las copas de los árboles del Cajón de Maipo.",
    "Diseño de mandala complejo que invita a la contemplación y llena el espacio de calma.",
    "Espejo de estilo clásico colonial con marcos de vitral emplomado en azul profundo.",
    "Portal místico de vidrio que enmarca el paisaje exterior con bordes de color y textura.",
    "Pequeña estrella de vitral facetado que destella con el sol de la tarde.",
    "Composición zen en tonos grises, humo y transparentes para propiciar espacios de calma y relax.",
    "Panel que recrea los intensos colores del atardecer cordillerano en rojos, violetas y dorados.",
    "Vitral compuesto de prismas geométricos que refractan la luz creando patrones en las paredes.",
    "Atrapasol orgánico con forma de hoja de parra, rindiendo tributo a la tradición vitivinícola del valle.",
    "Vitral circular que simboliza la mirada de la cordillera y la protección del hogar.",
    "Lámpara Tiffany con detalles de libélulas y vidrios iridiscentes que brillan aun apagada.",
    "Panel vertical que emula la caída de agua de una cascada cordillerana mediante vidrios texturados.",
    "Espejo redondo enmarcado en un rosetón clásico de vitral, una pieza de gran elegancia.",
    "Composición simétrica que aporta equilibrio visual y proyecta una luz serena.",
    "Pequeño atrapasol con forma de flor de cactus andino en vibrante color fucsia.",
    "Representación del espíritu de las montañas y la nieve eterna de los Andes.",
    "Panel de noche con tonos azules y blancos que captura la misteriosa luz lunar.",
    "Vitral que incorpora texturas inspiradas en las formaciones de cuarzo de la cordillera.",
    "Atrapasol colgante con forma de pluma y acabados iridiscentes que brillan con el movimiento.",
    "Escultura de vitral autoportante diseñada para capturar corrientes de luz sobre repisas.",
    "Lámpara Tiffany que rinde homenaje al peumo, árbol emblemático de la zona central de Chile.",
    "Panel decorativo con patrones geométricos inspirados en el trazado de los valles andinos.",
    "Espejo de diseño sobrio con bordes biselados en vidrio de color humo.",
    "Representación de la flor de loto en vitral, símbolo de pureza y crecimiento espiritual.",
    "Atrapasol circular de tamaño mediano con diseño simplificado de mandala andino.",
    "Obra que plasma los reflejos cambiantes del sol sobre el agua en el Cajón.",
    "Panel con vidrios en tonos cálidos y texturas de fuego para dar energía al espacio.",
    "Vitral que actúa como un portal de luz, ideal para transformar rincones oscuros.",
    "Atrapasol con forma de hoja de canelo, el árbol sagrado, en hermosos tonos verdes.",
    "Vitral circular que celebra el renacer diario del sol tras las montañas.",
    "Lámpara de diseño romántico Tiffany con patrones de rosas rojas y vidrios verdes.",
    "Panel abstracto que juega con la luz y la sombra mediante la intersección de planos.",
    "Espejo con marco decorado en mosaico de vidrio (vitromosaico) de vivos colores.",
    "Obra emplomada que combina maderas y vidrios en tonos cobrizos y bronce.",
    "Atrapasol de libélula en vidrio turquesa y ámbar, liviano y fácil de colgar.",
    "Vitral con líneas fluidas que evocan las corrientes del río y la brisa del valle.",
    "Panel estrellado inspirado en las despejadas noches astronómicas del Cajón.",
    "Representación alegre y luminosa de un girasol en vidrio amarillo opalescente.",
    "Atrapasol simple pero efectivo con una gema facetada central que refracta la luz.",
    "Obra compuesta de tres paneles integrados que representan la cordillera.",
    "Lámpara Tiffany de tonos violetas y lavanda que genera una luz relajante.",
    "Panel diseñado para crear un punto focal sagrado en salas de estar o meditación.",
    "Espejo con detalles de hojas de lenga en vidrios otoñales dorados y rojizos.",
    "Vitral con destellos de vidrios amarillos y claros que maximizan la entrada de luz.",
    "Atrapasol de colibrí en vibrantes tonos rojos e iridiscentes que dan dinamismo.",
    "Composición geométrica pura para los amantes del diseño limpio y minimalista.",
    "Panel inspirado en un denso bosque de arrayanes con sus característicos troncos.",
    "Vitral que incorpora alambres y detalles de cobre en su estructura emplomada.",
    "Atrapasol con forma de luna creciente de cristal texturado y destellos plateados.",
    "Vitral circular que evoca la mirada del valle, un amuleto de luz para el hogar.",
    "Lámpara Tiffany decorada con motivos de hojas secas en tonos bronce y ocre.",
    "Panel alargado que dibuja la silueta del perfil cordillerano contra el cielo.",
    "Espejo con enmarcado clásico y elegante de vitral en tonos ámbar y transparente.",
    "Vitral de colección que encierra la esencia y el espíritu del Cajón del Maipo.",
    "Atrapasol colgante de estrella fugaz que deja una estela de gemas facetadas.",
    "Composición simétrica perfecta que inspira orden, calma y equilibrio visual.",
    "Panel con tonos fríos y transparentes que evoca la luz clara del invierno.",
    "Vitral que recrea los tonos mágicos del ocaso sobre las altas cumbres.",
    "Lámpara Tiffany de diseño puramente geométrico y colores primarios armonizados.",
    "Panel vertical con vidrios verdes esmeralda que imitan la luz filtrada por el agua.",
    "Espejo redondo decorado con flores de vitral azul y hojas verdes.",
    "Una hermosa representación de la silueta cordillerana coronada por el sol.",
    "Atrapasol en forma de gota con vidrio texturado transparente que imita el rocío."
]

products_list = []

for idx, (path, original_filename) in enumerate(unique_items):
    # Determine names
    name = nombres_seo[idx % len(nombres_seo)]
    if idx >= len(nombres_seo):
        name = f"{name} {idx + 1}"
    
    # Generate clean SEO filename
    seo_slug = name.lower().replace(" ", "-").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u").replace("ñ", "n").replace(",", "").replace(".", "")
    new_filename = f"{seo_slug}.webp"
    dest_path = os.path.join(collection_dir, new_filename)
    
    # Convert and save as WebP
    try:
        img = Image.open(path)
        img.save(dest_path, 'WEBP', quality=85)
        print(f"Converted {original_filename} -> {new_filename}")
        
        # Add to database
        prod_id = f"p-vitral-fotos-{idx+1}"
        price = 45000 + (idx % 15) * 15000  # realistic prices between 45k and 255k CLP
        desc = descripciones_poeticas[idx % len(descripciones_poeticas)]
        
        products_list.append({
            "id": prod_id,
            "name": name,
            "category": "Vitrales",
            "price": price,
            "image": f"assets/images/collection/{new_filename}",
            "description": desc
        })
    except Exception as e:
        print(f"Error converting {original_filename}: {e}")

# Save generated products database
import json
with open('new_vitrales.json', 'w', encoding='utf-8') as f:
    json.dump(products_list, f, ensure_ascii=False, indent=2)

print(f"Successfully processed {len(products_list)} new vitrales.")
