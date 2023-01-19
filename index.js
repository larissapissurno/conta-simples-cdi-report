const fs = require("fs");

const demonstrativo = require("./demonstrativo.json");

const formatted = demonstrativo
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

const jsonContent = JSON.stringify(formatted);

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

console.table(formatted);
