export type WorkoutStyle = "EMOM" | "Tradicional";

export interface Exercise {
  name: string;
  target: string;
  difficulty: "Básico" | "Intermedio" | "Avanzado";
  videoUrl?: string;
  notes?: string;
}

export interface WorkoutBlock {
  style: WorkoutStyle;
  duration?: string;
  description: string;
  exercises: Exercise[];
}

export interface RoutineDay {
  id: string;
  label: string;
  icon: string;
  focus: string;
  core?: boolean;
  blocks: WorkoutBlock[];
  highlight: string;
}

export interface WeeklyProgression {
  week: string;
  adjustment: string;
}

export interface RegisterEntry {
  day: string;
  exercise: string;
  weeks: string[];
}

export const routineDays: RoutineDay[] = [
  {
    id: "monday",
    label: "Lunes",
    icon: "emoji_events",
    focus: "Pecho, Hombros, Tríceps + ABS (Core Funcional)",
    core: true,
    highlight:
      "Combina EMOM controlado y series al fallo técnico; abs siempre sin tocar el suelo.",
    blocks: [
      {
        style: "EMOM",
        duration: "10 min c/u",
        description: "Empuje vertical y fondos manteniendo RPE 7–8.",
        exercises: [
          {
            name: "Pike push-ups / Handstand push-ups",
            target: "4–5 reps/min × 10 min",
            difficulty: "Avanzado",
            videoUrl:
              "https://www.youtube.com/results?search_query=pike+push+ups+handstand+pushups",
            notes:
              "Si controlas el handstand, usa la variación estricta; si no, mantén un pike sólido.",
          },
          {
            name: "Fondos en paralelas",
            target: "3–4 reps/min × 10 min",
            difficulty: "Intermedio",
            videoUrl:
              "https://www.youtube.com/results?search_query=fondos+paralelas+tecnica",
            notes: "Bajada lenta, pecho abierto y bloquea codos solo al final.",
          },
        ],
      },
      {
        style: "Tradicional",
        description:
          "Hipertrofia de empuje tempo lento; llega al fallo técnico.",
        exercises: [
          {
            name: "Flexiones declinadas",
            target: "4×6–10",
            difficulty: "Intermedio",
            videoUrl:
              "https://www.youtube.com/results?search_query=flexiones+declinadas",
            notes: "Controla 2–3 s de bajada manteniendo core activo.",
          },
          {
            name: "Flexiones 1/2 + completa (tempo)",
            target: "4×4–6",
            difficulty: "Avanzado",
            videoUrl:
              "https://www.youtube.com/results?search_query=flexiones+tempo+lento",
            notes:
              "Realiza media repetición y luego la completa sin perder tensión.",
          },
          {
            name: "Enterradoras (finisher opcional)",
            target: "4×7",
            difficulty: "Intermedio",
            videoUrl:
              "https://www.youtube.com/results?search_query=enterradoras+flexiones",
            notes:
              "Úsalas solo si queda energía para terminar con bombeo extra.",
          },
          {
            name: "Elevaciones laterales con banda",
            target: "3×8–12",
            difficulty: "Básico",
            videoUrl:
              "https://www.youtube.com/results?search_query=elevaciones+laterales+banda",
            notes: "Mantén codos semirrígidos y controla la bajada.",
          },
        ],
      },
      {
        style: "Tradicional",
        description:
          "ABS funcionales en barra o apoyo elevado, sin tocar el suelo.",
        exercises: [
          {
            name: "Plancha inclinada en barra",
            target: "3×40–60 s",
            difficulty: "Intermedio",
            videoUrl:
              "https://www.youtube.com/results?search_query=plancha+inclinada+barra",
            notes:
              "Empuja la barra lejos de ti y mantén cuerpo en línea recta.",
          },
          {
            name: "Side plank de pie en barra",
            target: "3×20–30 s por lado",
            difficulty: "Intermedio",
            videoUrl:
              "https://www.youtube.com/results?search_query=plancha+lateral+de+pie+barra",
            notes: "Rota el tronco manteniendo cadera elevada.",
          },
          {
            name: "Knee raises en barra baja",
            target: "3×8–12",
            difficulty: "Básico",
            videoUrl:
              "https://www.youtube.com/results?search_query=knee+raises+barra",
            notes: "Lleva rodillas al pecho sin balanceo.",
          },
        ],
      },
    ],
  },
  {
    id: "tuesday",
    label: "Martes",
    icon: "taunt",
    focus: "Espalda y Bíceps",
    highlight:
      "Controla negativos en dominadas y remos; termina con agarre isométrico.",
    blocks: [
      {
        style: "EMOM",
        duration: "10 min c/u",
        description:
          "Dominadas asistidas y remo invertido priorizando técnica.",
        exercises: [
          {
            name: "Dominadas negativas o asistidas",
            target: "3–4 reps/min × 10 min",
            difficulty: "Intermedio",
            videoUrl:
              "https://www.youtube.com/results?search_query=dominadas+negativas",
            notes: "3 s de bajada y depresión escapular al inicio.",
          },
          {
            name: "Remo invertido (barra/mesa/anillas)",
            target: "8–10 reps/min × 10 min",
            difficulty: "Básico",
            videoUrl:
              "https://www.youtube.com/results?search_query=remo+invertido+barra",
            notes: "Ajusta la altura de los pies para regular la intensidad.",
          },
        ],
      },
      {
        style: "Tradicional",
        description: "Hipertrofia del tirón con pausas arriba.",
        exercises: [
          {
            name: "Chin-up con pausa arriba (lag)",
            target: "4×3–5",
            difficulty: "Avanzado",
            videoUrl:
              "https://www.youtube.com/results?search_query=chin+up+lag",
            notes: "Mantén 1–2 s arriba para reforzar dorsales y bíceps.",
          },
          {
            name: "Dominada australiana supina",
            target: "3×8–12",
            difficulty: "Básico",
            videoUrl:
              "https://www.youtube.com/results?search_query=dominada+australiana+supina",
            notes: "Mantén codos pegados y pecho alto.",
          },
          {
            name: "Curl Hephesto (banda/toalla)",
            target: "3×6–8",
            difficulty: "Avanzado",
            videoUrl:
              "https://www.youtube.com/results?search_query=curl+hefesto+banda",
            notes:
              "Hombros alineados encima de las manos; controla la palanca.",
          },
        ],
      },
      {
        style: "Tradicional",
        description: "Final isométrico para el agarre supino.",
        exercises: [
          {
            name: "Hang supino (agarre de bíceps)",
            target: "3×10–15 s",
            difficulty: "Intermedio",
            videoUrl:
              "https://www.youtube.com/results?search_query=hang+supino",
            notes: "Mantén mentón cerca de la barra sin perder tensión.",
          },
        ],
      },
    ],
  },
  {
    id: "wednesday",
    label: "Miércoles",
    icon: "directions_walk",
    focus: "Piernas",
    highlight:
      "Mantén rango completo; añade salto o lastre si el volumen resulta fácil.",
    blocks: [
      {
        style: "EMOM",
        duration: "10 min c/u",
        description: "Resistencia local y control unilateral durante 20 min.",
        exercises: [
          {
            name: "Sentadilla profunda",
            target: "10 reps/min × 10 min",
            difficulty: "Básico",
            videoUrl:
              "https://www.youtube.com/results?search_query=sentadilla+profunda+calistenia",
            notes: "Talones abajo y rodillas siguen a los dedos de los pies.",
          },
          {
            name: "Zancadas alternadas",
            target: "8 por pierna/min × 10 min",
            difficulty: "Intermedio",
            videoUrl:
              "https://www.youtube.com/results?search_query=zancadas+alternadas",
            notes: "Mantén torso erguido y paso largo para activar glúteo.",
          },
        ],
      },
      {
        style: "Tradicional",
        description: "Glúteo y femoral, prioriza control y isometrías.",
        exercises: [
          {
            name: "Puente de glúteo unilateral",
            target: "3×10–12 por pierna",
            difficulty: "Básico",
            videoUrl:
              "https://www.youtube.com/results?search_query=puente+de+gluteo+unilateral",
            notes: "Empuja con el talón y mantén retroversión pélvica.",
          },
          {
            name: "Wall sit (isométrico)",
            target: "3×40–60 s",
            difficulty: "Básico",
            videoUrl:
              "https://www.youtube.com/results?search_query=wall+sit+isometrico",
            notes: "Ajusta a 90° de rodilla; no apoyes manos en las piernas.",
          },
        ],
      },
      {
        style: "Tradicional",
        description:
          "Opcional: potencia al final para elevar la frecuencia cardiaca.",
        exercises: [
          {
            name: "Sentadilla con salto (opcional)",
            target: "2×10",
            difficulty: "Intermedio",
            videoUrl:
              "https://www.youtube.com/results?search_query=sentadilla+con+salto",
            notes: "Aterriza suave y regula si ya sientes fatiga excesiva.",
          },
        ],
      },
    ],
  },
  {
    id: "thursday",
    label: "Jueves",
    icon: "bolt",
    focus: "Pecho, Hombros, Tríceps (Variación)",
    highlight: "Énfasis en tempo y pseudo planche; sin fallo en EMOM.",
    blocks: [
      {
        style: "EMOM",
        duration: "10 min c/u",
        description: "Variaciones técnicas con bajadas controladas.",
        exercises: [
          {
            name: "Fondos tempo (3 s de bajada)",
            target: "3 reps/min × 10 min",
            difficulty: "Avanzado",
            videoUrl:
              "https://www.youtube.com/results?search_query=fondos+tempo+calistenia",
            notes: "Cronometra 3 s bajada y 1 s pausa abajo.",
          },
          {
            name: "Flexiones arqueras / pseudo planche push-ups",
            target: "5 reps/min × 10 min",
            difficulty: "Avanzado",
            videoUrl:
              "https://www.youtube.com/results?search_query=pseudo+planche+push+ups",
            notes:
              "Carga el peso hacia delante; alterna lados si usas arqueras.",
          },
        ],
      },
      {
        style: "Tradicional",
        description:
          "Series lentas y isométricas para reforzar hombro anterior.",
        exercises: [
          {
            name: "Pike push-up isométrico (hold arriba)",
            target: "3×10 s",
            difficulty: "Intermedio",
            videoUrl:
              "https://www.youtube.com/results?search_query=pike+push+hold",
            notes: "Empuja fuerte contra el suelo y mantén escápulas elevadas.",
          },
          {
            name: "Flexiones lentas",
            target: "3×8–12",
            difficulty: "Básico",
            videoUrl:
              "https://www.youtube.com/results?search_query=flexiones+lentas+tempo",
            notes: "4 s descenso + 1 s subida manteniendo core rígido.",
          },
          {
            name: "Dips en silla / fondos entre bancos",
            target: "2×10",
            difficulty: "Básico",
            videoUrl:
              "https://www.youtube.com/results?search_query=dips+en+silla",
            notes:
              "Rango completo y hombros deprimidos para proteger articulaciones.",
          },
        ],
      },
    ],
  },
  {
    id: "friday",
    label: "Viernes",
    icon: "sync",
    focus: "Espalda, Bíceps + ABS (Estética + Fuerza)",
    core: true,
    highlight: "Último día: tirón con pausa y core colgado sin tocar el suelo.",
    blocks: [
      {
        style: "EMOM",
        duration: "10 min c/u",
        description: "Dominadas con pausa y remo pronado para densidad.",
        exercises: [
          {
            name: "Chin-ups con pausa arriba",
            target: "3–4 reps/min × 10 min",
            difficulty: "Avanzado",
            videoUrl:
              "https://www.youtube.com/results?search_query=chin+up+pausa",
            notes: "Pausa 1–2 s arriba y baja en 3 s.",
          },
          {
            name: "Remo invertido estrecho o pronado",
            target: "8 reps/min × 10 min",
            difficulty: "Intermedio",
            videoUrl:
              "https://www.youtube.com/results?search_query=remo+invertido+pronado",
            notes: "Agarre estrecho, core firme y glúteos apretados.",
          },
        ],
      },
      {
        style: "Tradicional",
        description: "Tirón accesible para congestión final.",
        exercises: [
          {
            name: "Australianas supinas",
            target: "3×8–12",
            difficulty: "Básico",
            videoUrl:
              "https://www.youtube.com/results?search_query=australian+pull+ups+supinas",
            notes: "Aprieta escapulas al inicio y al final de cada repetición.",
          },
          {
            name: "Curl banda/toalla (bombeo final)",
            target: "3×12–15",
            difficulty: "Básico",
            videoUrl:
              "https://www.youtube.com/results?search_query=curl+con+banda+toalla",
            notes: "Tempo de 2 s subida + 2 s bajada sin balanceo.",
          },
        ],
      },
      {
        style: "Tradicional",
        description: "ABS fuerza + estética sin apoyar en el suelo.",
        exercises: [
          {
            name: "Hanging knee raises",
            target: "3×10–12",
            difficulty: "Intermedio",
            videoUrl:
              "https://www.youtube.com/results?search_query=hanging+knee+raises",
            notes: "Lleva rodillas hacia el pecho sin impulso.",
          },
          {
            name: "Hanging L-sit tuck (isométrico)",
            target: "3×10–20 s",
            difficulty: "Avanzado",
            videoUrl:
              "https://www.youtube.com/results?search_query=hanging+l+sit+tuck",
            notes: "Mantén espalda redondeada y piernas paralelas al suelo.",
          },
          {
            name: "Oblique knee raises (colgado)",
            target: "3×8 por lado",
            difficulty: "Intermedio",
            videoUrl:
              "https://www.youtube.com/results?search_query=knee+raises+oblicuos+colgado",
            notes: "Rota cadera controladamente hacia cada lado.",
          },
          {
            name: "Anti-rotation press (Pallof con banda)",
            target: "3×12–15 por lado",
            difficulty: "Básico",
            videoUrl:
              "https://www.youtube.com/results?search_query=pallof+press+banda",
            notes: "Resiste la rotación manteniendo costillas abajo.",
          },
        ],
      },
    ],
  },
];

export const weeklyProgression: WeeklyProgression[] = [
  {
    week: "Semanas 1–2",
    adjustment: "Mantén reps fijas y prioriza técnica impecable.",
  },
  {
    week: "Semanas 3–4",
    adjustment: "+1 rep/min en EMOM principales si controlas el ritmo.",
  },
  {
    week: "Semanas 5–6",
    adjustment: "Añade lastre ligero (3–5 kg) o variaciones más difíciles.",
  },
  {
    week: "Semana 7+",
    adjustment: "Aumenta el tiempo bajo tensión (tempos lentos o isometrías).",
  },
];

export const generalTips = [
  "No llegues al fallo en EMOM (RPE 7–8).",
  "Sí busca fallo técnico en series tradicionales.",
  "Descanso entre series: 60–90 s.",
  "Mantén abdomen firme en todos los movimientos.",
  "Alimentación y sueño son tan importantes como la rutina.",
  "Registra tus repeticiones semanalmente para progresar.",
];

export const weeklyRegister: RegisterEntry[] = [
  {
    day: "Lunes",
    exercise: "Pike push-ups / HSPU",
    weeks: ["4 reps/min", "4 reps/min", "5 reps/min", "5 reps/min + lastre"],
  },
  {
    day: "Martes",
    exercise: "Chin-up lag",
    weeks: ["3 reps/min", "3 reps/min", "4 reps/min", "4 reps/min + mochila"],
  },
  {
    day: "Miércoles",
    exercise: "Sentadilla profunda",
    weeks: [
      "10 reps/min",
      "10 reps/min",
      "11 reps/min",
      "12 reps/min con salto",
    ],
  },
  {
    day: "Jueves",
    exercise: "Fondos tempo",
    weeks: [
      "3 reps/min",
      "3 reps/min",
      "4 reps/min",
      "4 reps/min + tempo lento",
    ],
  },
  {
    day: "Viernes",
    exercise: "Chin-ups pausa",
    weeks: ["3 reps/min", "3 reps/min", "4 reps/min", "4 reps/min + isometría"],
  },
];
