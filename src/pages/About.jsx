export default function About() {
  return (
    <section className="px-6 py-16 bg-gray-50 text-gray-800">
      <div className="max-w-5xl mx-auto text-center">
        {/* Titre */}
        <h2 className="text-3xl font-bold mb-4">À propos de <span className="text-blue-600">Enginetech</span></h2>
        <p className="text-lg text-gray-600 mb-12">
          Une communauté dynamique créée par et pour les élèves ingénieurs,
          qui ouvre des portes vers des <span className="font-semibold">opportunités professionnelles</span>
          et les dernières <span className="font-semibold">tendances technologiques</span>.
        </p>

        {/* Mission et Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 bg-white shadow-md rounded-2xl">
            <h3 className="text-xl font-semibold mb-3">🎯 Notre mission</h3>
            <p>
              Accompagner les futurs ingénieurs dans leur parcours en mettant à leur
              disposition des ressources, des événements et des opportunités pour développer
              leurs compétences et booster leur carrière.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-2xl">
            <h3 className="text-xl font-semibold mb-3">🚀 Notre vision</h3>
            <p>
              Construire une communauté innovante et collaborative où chaque ingénieur
              peut apprendre, partager et contribuer aux avancées technologiques de demain.
            </p>
          </div>
        </div>

        {/* Opportunités + Tech News */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 bg-blue-50 rounded-2xl">
            <h3 className="text-xl font-semibold mb-3">💼 Opportunités professionnelles</h3>
            <p>
              Stages, projets collaboratifs et connexions avec les entreprises pour donner
              vie à vos ambitions.
            </p>
          </div>
          <div className="p-6 bg-green-50 rounded-2xl">
            <h3 className="text-xl font-semibold mb-3">📰 Nouveautés tech</h3>
            <p>
              Restez informés des dernières innovations technologiques et tendances du marché
              grâce à nos partages réguliers.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-8">
          <a
            href="/contact"
            className="px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
          >
            Rejoindre la communauté
          </a>
        </div>
      </div>
    </section>
  );
}
