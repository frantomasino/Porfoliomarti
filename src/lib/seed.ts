import type {
  Project,
  Service,
  SiteProfile,
  TimelineItem,
} from "@/lib/types";

export const SITE_ID = "11111111-1111-4111-8111-111111111111";

export const seedSite: SiteProfile = {
  id: SITE_ID,
  full_name: "Martina",
  studio_name: "Estudio ARQ.MR",
  profession: "Arquitecta e interiorista",
  tagline: "Proyectos integrales, interiorismo y reformas.",
  bio: "Martina es arquitecta e interiorista. Desde Estudio ARQ.MR, en Buenos Aires, desarrolla proyectos integrales, interiorismo y reformas: espacios para habitar, trabajar y encontrarse, pensados a medida de cada encargo.",
  philosophy:
    "El trabajo parte de escuchar el lugar y a quien lo va a vivir. Cada obra se resuelve con una mirada atenta a la materialidad, la luz y el detalle, desde el anteproyecto hasta la obra.",
  location: "Buenos Aires, Argentina",
  email: "",
  phone: "",
  instagram: "https://www.instagram.com/estudioarq.mr/",
  linkedin: "",
  hero_image_url:
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=2400&q=80",
  portrait_url:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1600&q=80",
  seo_title: "Estudio ARQ.MR — Martina, arquitecta e interiorista",
  seo_description:
    "Estudio de arquitectura e interiorismo en Buenos Aires. Proyectos integrales, reformas y diseño de interiores.",
  founded_year: 2020,
};

export const seedProjects: Project[] = [
  {
    id: "c1a1e001-0000-4000-8000-000000000001",
    title: "Obra PS",
    slug: "obra-ps",
    category: "Residencial",
    year: 2024,
    location: "Palermo, Buenos Aires",
    client: "Privado",
    area: "420 m²",
    status: "Construido",
    excerpt:
      "Vivienda pensada como un proyecto integral: arquitectura, interiorismo y detalle de obra.",
    description:
      "Casa Atelier nace de un encargo doble: habitar y producir. El proyecto coloca el taller hacia la calle, con una fachada de hormigón y madera que filtra la vida interior, y reserva la casa hacia un jardín posterior.\n\nLa secuencia espacial recorre un umbral sombreado, el patio central y las estancias elevadas. La luz se trabaja de manera lateral y cenital, de modo que cada recinto tenga su propia hora del día.\n\nLos materiales se reducen a hormigón visto, roble y piedra de laja. La estructura queda a la vista, y el detalle se concentra en los encuentros: umbrales, barandas, carpinterías de piso a techo.",
    cover_url:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80",
    featured: true,
    published: true,
    sort_order: 1,
    images: [
      {
        id: "img-001-1",
        project_id: "c1a1e001-0000-4000-8000-000000000001",
        url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=80",
        caption: "Fachada hacia el jardín",
        sort_order: 1,
      },
      {
        id: "img-001-2",
        project_id: "c1a1e001-0000-4000-8000-000000000001",
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80",
        caption: "Patio de luz",
        sort_order: 2,
      },
      {
        id: "img-001-3",
        project_id: "c1a1e001-0000-4000-8000-000000000001",
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80",
        caption: "Estar principal",
        sort_order: 3,
      },
    ],
  },
  {
    id: "c1a1e001-0000-4000-8000-000000000002",
    title: "Obra 945",
    slug: "obra-945",
    category: "Residencial",
    year: 2023,
    location: "Tigre, Buenos Aires",
    client: "Fundación del Delta",
    area: "280 m²",
    status: "Construido",
    excerpt:
      "Un pabellón ligero sobre pilotes para exposiciones temporales, pensado para convivir con la crecida del río.",
    description:
      "El pabellón se posa sobre el paisaje del Delta sin pretender domesticarlo. Una plataforma de madera elevada libera el suelo para el agua y la vegetación, y un techo continuo de chapa y madera define un recinto de sombra.\n\nEl programa es deliberadamente simple: una sala, un foyer abierto y un depósito. La flexibilidad permite transformar el espacio de exposición en auditorio o taller.\n\nLa estructura de madera laminada se expresa con honestidad. Las carpinterías corredizas desaparecen en los muros, y el pabellón se abre por completo al río en los meses cálidos.",
    cover_url:
      "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=2000&q=80",
    featured: true,
    published: true,
    sort_order: 2,
    images: [
      {
        id: "img-002-1",
        project_id: "c1a1e001-0000-4000-8000-000000000002",
        url: "https://images.unsplash.com/photo-1600047509358-9dc75590d62e?auto=format&fit=crop&w=1800&q=80",
        caption: "Volumen sobre el paisaje",
        sort_order: 1,
      },
      {
        id: "img-002-2",
        project_id: "c1a1e001-0000-4000-8000-000000000002",
        url: "https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?auto=format&fit=crop&w=1800&q=80",
        caption: "Sala de exposiciones",
        sort_order: 2,
      },
    ],
  },
  {
    id: "c1a1e001-0000-4000-8000-000000000003",
    title: "Nodo Café",
    slug: "nodo-cafe",
    category: "Comercial",
    year: 2023,
    location: "San Telmo, Buenos Aires",
    client: "Privado",
    area: "165 m²",
    status: "Construido",
    excerpt:
      "Rehabilitación de un depósito de principios de siglo: se conservan los muros y se introduce una nueva geometría interior.",
    description:
      "El proyecto trabaja sobre un depósito de ladrillo visto. En lugar de borrar las marcas del tiempo, se las deja convivir con una carpintería nueva de roble y un núcleo de servicios en acero negro.\n\nLa vivienda se organiza en una sola nave. Un altillo liviano despega del muro original y contiene el dormitorio, de modo que el espacio principal conserve su altura original.\n\nLa paleta se reduce a ladrillo, madera, yeso y metal. La iluminación es indirecta, rasante sobre los muros, para subrayar la textura existente.",
    cover_url:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80",
    featured: true,
    published: true,
    sort_order: 3,
    images: [
      {
        id: "img-003-1",
        project_id: "c1a1e001-0000-4000-8000-000000000003",
        url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1800&q=80",
        caption: "Nave principal",
        sort_order: 1,
      },
      {
        id: "img-003-2",
        project_id: "c1a1e001-0000-4000-8000-000000000003",
        url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=80",
        caption: "Cocina y estar",
        sort_order: 2,
      },
    ],
  },
  {
    id: "c1a1e001-0000-4000-8000-000000000004",
    title: "Obra Contadores",
    slug: "obra-contadores",
    category: "Comercial",
    year: 2022,
    location: "Bariloche, Río Negro",
    client: "Privado",
    area: "310 m²",
    status: "Construido",
    excerpt:
      "Una casa de montaña que se recuesta sobre la pendiente y abre sus estancias principales al lago y al bosque.",
    description:
      "Casa Patagonia se implanta en una ladera orientada al norte. El volumen se quiebra en tres crujías para adaptarse a la topografía y protegerse del viento.\n\nEl estar, la cocina y la galería forman un único recinto hacia el paisaje. Los dormitorios se retiran hacia el bosque, con una paleta más íntima y ventanas bajas.\n\nLa estructura mixta de hormigón y madera de ciprés se deja a la vista. La cubierta de chapa se prolonga en aleros profundos que resuelven la nieve y la sombra de verano.",
    cover_url:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80",
    featured: true,
    published: true,
    sort_order: 4,
    images: [
      {
        id: "img-004-1",
        project_id: "c1a1e001-0000-4000-8000-000000000004",
        url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1800&q=80",
        caption: "Implantación en la ladera",
        sort_order: 1,
      },
      {
        id: "img-004-2",
        project_id: "c1a1e001-0000-4000-8000-000000000004",
        url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=80",
        caption: "Estar hacia el lago",
        sort_order: 2,
      },
    ],
  },
  {
    id: "c1a1e001-0000-4000-8000-000000000005",
    title: "Baño Cramer",
    slug: "bano-cramer",
    category: "Interiorismo",
    year: 2021,
    location: "Recoleta, Buenos Aires",
    client: "Galería Norte",
    area: "190 m²",
    status: "Construido",
    excerpt:
      "Reconversión de un local en una galería de arte contemporáneo, con una sala neutra y un patio de esculturas.",
    description:
      "La galería se articula en dos recintos: una sala blanca de proporción precisa y un patio posterior donde las obras se encuentran con la vegetación.\n\nSe eliminaron tabiques sucesivos para recuperar la profundidad original del lote. Un lucernario corrido baña el muro de exposición con luz norte, estable y sin deslumbramiento.\n\nEl piso de microcemento y los muros de yeso extrafino construyen un fondo silencioso. La recepción se resuelve con un único mostrador de travertino.",
    cover_url:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=2000&q=80",
    featured: false,
    published: true,
    sort_order: 5,
    images: [
      {
        id: "img-005-1",
        project_id: "c1a1e001-0000-4000-8000-000000000005",
        url: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1800&q=80",
        caption: "Sala principal",
        sort_order: 1,
      },
    ],
  },
  {
    id: "c1a1e001-0000-4000-8000-000000000006",
    title: "Obra Pizón",
    slug: "obra-pizon",
    category: "Residencial",
    year: 2020,
    location: "Rosario, Santa Fe",
    client: "Gobierno de Santa Fe",
    area: "1.240 m²",
    status: "Construido",
    excerpt:
      "Un edificio para la enseñanza de oficios tradicionales, organizado alrededor de patios de trabajo a cielo abierto.",
    description:
      "La escuela reúne talleres de carpintería, metal, cerámica y tejido. El edificio se dispone como una secuencia de naves y patios, de manera que el aprendizaje ocurra tanto en el interior como al aire libre.\n\nLos talleres miran a los patios de trabajo. Las aulas teóricas se agrupan en un volumen más cerrado, con luz cenital. Un porche continuo recorre todo el conjunto y funciona como espacio de encuentro.\n\nSe empleó ladrillo de producción local, hormigón y carpintería de quebracho. La materialidad busca ser pedagógica: cada encuentro constructivo queda a la vista para los estudiantes.",
    cover_url:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80",
    featured: false,
    published: true,
    sort_order: 6,
    images: [
      {
        id: "img-006-1",
        project_id: "c1a1e001-0000-4000-8000-000000000006",
        url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1800&q=80",
        caption: "Nave de talleres",
        sort_order: 1,
      },
      {
        id: "img-006-2",
        project_id: "c1a1e001-0000-4000-8000-000000000006",
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=80",
        caption: "Patio de trabajo",
        sort_order: 2,
      },
    ],
  },
];

export const seedTimeline: TimelineItem[] = [
  {
    id: "t-exp-1",
    kind: "experience",
    title: "Estudio ARQ.MR",
    subtitle: "Fundadora — arquitectura e interiorismo",
    period: "Hoy",
    description:
      "Proyectos integrales, interiorismo y reformas en Buenos Aires. Acompañamiento cercano desde la idea hasta la obra.",
    sort_order: 1,
  },
  {
    id: "t-edu-1",
    kind: "education",
    title: "Arquitectura e interiorismo",
    subtitle: "Formación profesional",
    period: "",
    description:
      "Práctica enfocada en vivienda, locales y reformas. El detalle de esta sección se puede completar desde el panel.",
    sort_order: 1,
  },
];

export const seedServices: Service[] = [
  {
    id: "s-1",
    title: "Proyectos integrales",
    description:
      "Arquitectura e interiorismo en un mismo proceso: vivienda, locales y espacios de trabajo, del croquis a la obra.",
    sort_order: 1,
  },
  {
    id: "s-2",
    title: "Interiorismo",
    description:
      "Diseño de interiores, materialidad, mobiliario y luz, pensados para cómo se vive cada espacio.",
    sort_order: 2,
  },
  {
    id: "s-3",
    title: "Reformas",
    description:
      "Intervenciones sobre lo existente: baños, cocinas, locales y viviendas, con una lectura atenta del lugar.",
    sort_order: 3,
  },
  {
    id: "s-4",
    title: "Dirección de obra",
    description:
      "Seguimiento cercano en obra, coordinación de gremios y control de los detalles que definen el resultado.",
    sort_order: 4,
  },
];
