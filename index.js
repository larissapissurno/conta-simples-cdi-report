const fs = require("fs");
const jsreport = require("@jsreport/jsreport-core")();
jsreport.use(require("@jsreport/jsreport-chrome-pdf")());
jsreport.use(require("@jsreport/jsreport-handlebars")());

const demonstrativo = require("./demonstrativo.json");
const { subDays, format } = require("date-fns");

const demostrativoFormatado = demonstrativo.items.map(
  ({
    remunerationDate,
    remunerationAmount,
    remunerationIof,
    remunerationIr,
  }) => {
    const dateFormat = "dd/MM/yyyy";
    const applicationDate = subDays(
      new Date(remunerationDate + "T00:00:00"),
      1
    );

    return {
      applicationDate: format(applicationDate, dateFormat),
      remunerationDate: format(
        new Date(remunerationDate + "T00:00:00"),
        dateFormat
      ),
      remunerationAmount: Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(remunerationAmount),
      remunerationIof,
      remunerationIr,
    };
  }
);

function ConsoleTabOutput() {
  const jsonContent = JSON.stringify(demostrativoFormatado);

  fs.writeFile(
    "demonstrativo-formatado.json",
    jsonContent,
    "utf8",
    function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }

      console.log("JSON file has been saved.");
    }
  );

  console.table(demostrativoFormatado);
}

async function PdfOutput() {
  const style = `
  <style>
    h1, p {
      font-family: Arial, Helvetica, sans-serif;
    }
    table {
      font-family: Arial, Helvetica, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }

    td,
    th {
      border: 1px solid #ddd;
      padding: 8px;
    }

    tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;
      background-color: #04aa6d;
      color: white;
    }
  </style>
  `;

  /**
   * por padrao vem em ordem decrescente
   */
  const dataFinal = new Date(
    demonstrativo.items[0].remunerationDate + "T00:00:00"
  );
  const dataFinalFormatada = format(dataFinal, "dd/MM/yyyy");

  const dataInicial = new Date(
    demonstrativo.items[demonstrativo.items.length - 1].remunerationDate +
      "T00:00:00"
  );
  const dataInicialFormatada = format(dataInicial, "dd/MM/yyyy");

  const headerElement = `
    <div>
      <h1>Relatório de Rendimentos CDI</h1>

      <p>Extrato de LS GLOBAL TECH LTDA</p>
      <p>Período entre ${dataInicialFormatada} e ${dataFinalFormatada}<p>
      <p>Conta número 62261443113</p>
    </div>
  `;

  const dataTemplate = demostrativoFormatado
    .map(
      ({
        applicationDate,
        remunerationDate,
        remunerationAmount,
        remunerationIof,
        remunerationIr,
      }) => `
      <tr>
        <td>${applicationDate}</td>
        <td>${remunerationDate}</td>
        <td>${remunerationAmount}</td>
        <td>${remunerationIof}</td>
        <td>${remunerationIr}</td>
      </tr>`
    )
    .join("");

  const template = `
    ${headerElement}

    <br />

    <table>
      <thead>
        <tr>
          <th>Data Aplicação</th>
          <th>Data Rendimento</th>
          <th>Valor Rendimento</th>
          <th>IOF</th>
          <th>IR</th>
        </tr>
      </thead>
      <tbody>
      ${dataTemplate}
      </tbody>
    </table>
  `;

  await jsreport.init();
  const result = await jsreport.render({
    template: {
      content: style + template,
      engine: "handlebars",
      recipe: "chrome-pdf",
    },
  });

  const reportDate = new Date(demonstrativo.items[0].remunerationDate);
  const dateFormatted = format(reportDate, "MM-yyyy");

  await fs.writeFile(
    `demonstrativo-cdi-${dateFormatted}.pdf`,
    result.content,
    "utf8",
    function (err) {
      if (err) {
        console.log("An error occurred while writing JSON Object to File.");
        return console.log(err);
      }

      console.log("JSON file has been saved.");
    }
  );
}

PdfOutput();
