const fs = require("fs");
const jsreport = require("@jsreport/jsreport-core")();
jsreport.use(require("@jsreport/jsreport-chrome-pdf")());
jsreport.use(require("@jsreport/jsreport-handlebars")());

const demonstrativo = require("./demonstrativo.json");

const demostrativoFormatado = demonstrativo
  .reduce((acc, curr) => {
    return [...acc, ...curr.items];
  }, [])
  .map(
    ({
      remunerationDate,
      remunerationAmount,
      remunerationIof,
      remunerationIr,
    }) => ({
      remunerationDate: Intl.DateTimeFormat("pt-BR").format(
        new Date(remunerationDate)
      ),
      remunerationAmount: Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(remunerationAmount),
      remunerationIof,
      remunerationIr,
    })
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

  const dataTemplate = demostrativoFormatado
    .map(
      ({
        remunerationDate,
        remunerationAmount,
        remunerationIof,
        remunerationIr,
      }) => `
      <tr>
        <td>${remunerationDate}</td>
        <td>${remunerationAmount}</td>
        <td>${remunerationIof}</td>
        <td>${remunerationIr}</td>
      </tr>`
    )
    .join("");

  const template = `
    <table>
      <thead>
        <tr>
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

  await fs.writeFile(
    "demonstrativo-cdi.pdf",
    result.content,
    "utf8",
    function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }

      console.log("JSON file has been saved.");
    }
  );
}

PdfOutput();
