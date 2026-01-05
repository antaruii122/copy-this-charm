import { Helmet } from "react-helmet-async";

const FAQ = () => {
    const faqs = [
        {
            question: "¿Cómo puede la nutrición mejorar mi fertilidad?",
            answer: "La nutrición juega un papel fundamental en la fertilidad. Una alimentación balanceada rica en antioxidantes, omega-3, proteínas de calidad y micronutrientes esenciales (como ácido fólico, zinc y vitamina D) ayuda a regular las hormonas, mejorar la calidad ovular, fortalecer el endometrio y crear un ambiente óptimo para la concepción. Además, mantener un peso saludable y reducir la inflamación a través de la dieta son factores clave para mejorar la fertilidad tanto en mujeres como en hombres."
        },
        {
            question: "¿Qué alimentos son mejores para equilibrar las hormonas?",
            answer: "Para equilibrar las hormonas naturalmente, recomiendo incluir: aguacate (grasas saludables), salmón wild (omega-3), nueces y semillas (especialmente semillas de calabaza y lino), verduras crucíferas (brócoli, col), bayas (antioxidantes), quinoa y avena (carbohidratos complejos), legumbres, y especias como la cúrcuma. Es igual de importante evitar: azúcares refinados, alcohol excesivo, aceites vegetales procesados y productos lácteos convencionales que pueden contener hormonas artificiales."
        },
        {
            question: "¿Qué debo comer en cada fase de mi ciclo menstrual?",
            answer: "Cada fase del ciclo requiere diferentesnutrientes: **Fase Menstrual** (días 1-5): Hierro (espinacas, lentejas), omega-3 (pescado), infusiones antiinflamatorias. **Fase Folicular** (días 6-14): Proteínas magras, vegetales frescos, semillas de lino, alimentos fermentados. **Fase Ovulatoria** (días 14-16): Fibra, vegetales de hoja verde, frutas antioxidantes, semillas de girasol. **Fase Lútea** (días 17-28): Carbohidratos complejos, magnesio (chocolate oscuro, almendras), calcio, vitamina B6. Adaptar tu alimentación al ciclo hormonal optimiza energía, humor y fertilidad."
        },
        {
            question: "¿Los programas son online o presenciales?",
            answer: "Todos nuestros programas son 100% online, lo que te permite acceder desde cualquier lugar de México o el mundo. Incluyen: consultas virtuales por videollamada, acceso a plataforma educativa 24/7, materiales descargables (guías, recetas, planes de comida), grupo privado de apoyo, y seguimiento personalizado vía WhatsApp. Esta modalidad te brinda flexibilidad, comodidad y el mismo nivel de atención profesional que una consulta presencial."
        },
        {
            question: "¿Cuánto tiempo toma ver resultados en mi ciclo hormonal?",
            answer: "Los cambios hormonales a través de la nutrición son graduales pero sostenibles. La mayoría de mis clientas notan: **2-4 semanas**: Mejora en energía, digestión y sueño. **1-2 ciclos menstruales**: Regulación del ciclo, reducción de síntomas premenstruales. **3-6 meses**: Equilibrio hormonal significativo, mejora en fertilidad, piel más clara. La constancia es clave. Los cambios permanentes requieren compromiso, pero los resultados son profundos y duraderos, abordando la raíz del desequilibrio hormonal."
        },
        {
            question: "¿Necesito hacer dietas restrictivas?",
            answer: "¡Absolutamente no! Mi enfoque NO se basa en dietas restrictivas, contar calorías o eliminar grupos alimenticios. En lugar de eso, trabajo con nutrición consciente que significa: agregar alimentos nutritivos (no quitar), entender las señales de tu cuerpo, comer según tus necesidades hormonales, disfrutar la comida sin culpa, y crear hábitos sostenibles a largo plazo. El objetivo es nutrir tu cuerpo, no castigarlo. Una alimentación balanceada, flexible y personalizada es mucho más efectiva."
        },
        {
            question: "¿Puedo mejorar SOP (Síndrome de Ovario Poliquístico) con nutrición?",
            answer: "Sí, la nutrición es una de las herramientas más poderosas para manejar SOP. Un plan nutricional especializado puede: reducir resistencia a la insulina (causa principal), equilibrar andrógenos (reducir acné, hirsutismo), regular ciclos menstruales, mejorar ovulación y fertilidad, controlar peso de manera saludable, y reducir inflamación. Recomiendo: control de carbohidratos (no eliminación), proteínas en cada comida, grasas antiinflamatorias, suplementación específica (inositol, omega-3), y manejo de estrés. Muchas clientas con SOP logran embarazos naturales."
        },
        {
            question: "¿Qué incluye una consulta nutricional?",
            answer: "Una consulta conmigo incluye: **Evaluación completa** (60-90 min): Historia clínica, análisis hormonal, hábitos alimenticios, objetivos personales. **Plan personalizado**: Menú adaptado a tu ciclo, recetas específicas, lista de compras, guía de suplementos. **Seguimiento continuo**: Consultas de revisión, ajustes según progreso, soporte vía WhatsApp. **Materiales educativos**: Guías, videos, recursos descargables. **Acceso a comunidad**: Grupo privado de apoyo. Todo  diseñado para empoderarte con conocimiento y herramientas prácticas."
        },
        {
            question: "¿La nutrición puede ayudar durante la menopausia?",
            answer: "¡Definitivamente! La nutrición es fundamental para transitar la menopausia con vitalidad. Puede ayudar a: reducir sofocos y sudores nocturnos (fitoestrógenos), mantener densidad ósea (calcio, vitamina D, K2), controlar peso (metabolismo más lento), mejorar estado de ánimo (omega-3, vitaminas B), proteger salud cardiovascular, aumentar energía, y mejorar calidad de sueño. Alimentos clave: soya fermentada, semillas de lino, vegetales de hoja verde, proteínas, grasas saludables. El programa MENO está específicamente diseñado para esta etapa."
        },
        {
            question: "¿Ofrecen planes nutricionales para parejas?",
            answer: "Sí, ofrezco programas especializados para parejas que buscan concebir, ya que la fertilidad masculina es igualmente importante. El plan para parejas incluye: evaluación nutricional completa para ambos, plan alimenticio adaptado a cada uno, suplementación específica (para ella: ácido fólico, omega-3; para él: zinc, selenio, antioxidantes), recetas diseñadas para mejorar calidad espermática y ovular, y seguimiento conjunto. Trabajar juntos aumenta el compromiso, los resultados y fortalece el proyecto de familia."
        },
        {
            question: "¿Cuánto cuesta una consulta inicial?",
            answer: "Ofrezco **consulta inicial gratuita de 20 minutos** para conocernos, entender tus necesidades y ver si mi enfoque es adecuado para ti. Después, las consultas completas tienen diferentes opciones: **Consulta individual**: $800-1200 MXN. **Programas estructurados**: Desde $1,200 (MENO 21 días) hasta paquetes completos. **Membresía mensual**: $99/mes con acceso continuo. También ofrezco planes de pago y paquetes con descuento. La inversión en tu salud hormonal tiene retorno invaluable en calidad de vida."
        },
        {
            question: "¿Necesito estudios médicos antes de empezar?",
            answer: "No es obligatorio, pero es muy recomendable tener análisis de sangre recientes (especialmente perfil hormonal: TSH, prolactina, progesterona, estradiol, testosterona; y metabólico: glucosa, insulina, perfil lipídico, vitamina D). Estos estudios permiten: personalizar completamente tu plan nutricional, identificar deficiencias específicas, establecer línea base para medir progreso, y determinar suplementación necesaria. Si no tienes estudios recientes, puedo recomendarte qué análisis solicitar a tu médico. Trabajo en colaboración con tu equipo de salud."
        }
    ];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <>
            <Helmet>
                <title>Preguntas Frecuentes | Alimenta tu Fertilidad</title>
                <meta name="description" content="Respuestas a las preguntas más frecuentes sobre nutrición hormonal, fertilidad, ciclo menstrual y programas de Alimenta tu Fertilidad." />
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Helmet>

            <div className="min-h-screen bg-background pt-24 pb-20">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 text-gradient">
                            Preguntas Frecuentes
                        </h1>
                        <p className="text-muted-foreground text-xl">
                            Encuentra respuestas a las preguntas más comunes sobre nutrición hormonal y fertilidad
                        </p>
                    </div>

                    {/* FAQ List */}
                    <div className="max-w-4xl mx-auto space-y-6">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-300 animate-fade-up"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 flex items-start gap-4">
                                    <span className="text-primary font-bold flex-shrink-0">Q{index + 1}.</span>
                                    <span>{faq.question}</span>
                                </h2>
                                <p className="text-muted-foreground text-lg leading-relaxed pl-12">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-16">
                        <p className="text-muted-foreground text-xl mb-6">
                            ¿Tienes más preguntas?
                        </p>
                        <a
                            href="#contacto"
                            className="inline-flex items-center justify-center px-12 py-5 bg-gradient-rose text-white font-bold text-lg rounded-2xl hover:scale-105 hover:glow-rose transition-all duration-300 shadow-2xl"
                        >
                            Agendar Consulta Gratuita
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FAQ;
