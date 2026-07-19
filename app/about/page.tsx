const facts = [
  {
    label: "Оператор",
    text: "Единственный оператор сбора мусора в городе — «Орал Таза Сервис».",
  },
  {
    label: "Полигон",
    text: "Действующий полигон открыт в 1975 году, переполнен, регулярно горит летом.",
  },
  {
    label: "Переработка",
    text: 'Реальная переработка по городу — около 10–15%. По области официально отчитывается 27,8% "отсортировано".',
  },
  {
    label: "Раздельный сбор",
    text: "Около 700 сетчатых контейнеров под пластик, 400 контейнеров-«бутылок» и всего 3 эко-пункта — работают с конца 2024 года.",
  },
  {
    label: "Новый полигон",
    text: "Проект нового полигона (70 га, ~8 млрд тг) существует только на бумаге — финансирование на 2026 год не выделено.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl bg-champagne p-8">
        <h1 className="text-2xl font-bold text-codium">О системе</h1>
        <p className="mt-2 text-bistre">
          Почему цифровое управление отходами нужно Уральску — по фактам.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.label} className="rounded-xl bg-champagne p-6">
            <p className="text-sm font-medium uppercase tracking-wide text-bistre">
              {fact.label}
            </p>
            <p className="mt-2 text-codium">{fact.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
