# conta-simples-cdi-report

Este projeto tem como objetivo traduzir o arquivo de demonstrativo de rendimentos CDI do banco Conta Simples que está em formato JSON para uma tabela em arquivo PDF


## How to:

- Certifique-se que você tem o Node a partir da versão 16 instalado em sua máquina

- Abra o terminal na raíz do projeto e rode o seguinte comando:
  `npm install`
  
- Na pasta raíz do projeto, crie um novo arquivo chamado `demonstrativo.json`

- Cole o conteúdo do demonstrativo de rendimentos CDI do banco Conta Simples no arquivo `demonstrativo.json`

- :warning: O conteúdo deve estar no seguinte formato:

```
{
    "previousPage": 0,
    "currentPage": 0,
    "nextPage": 1,
    "last": false,
    "totalPages": 111,
    "totalItems": 111,
    "maxItemsPerPage": 111,
    "totalItemsPage": 111,
    "items": [
        {
            "idAccount": 111,
            "remunerationId": "aaa",
            "remunerationDate": "2022-10-12",
            "remunerationAmount": 111,
            "remunerationStatus": "PAID",
            "remunerationIof": 111,
            "remunerationIr": 111
        },

    ...
```

- Abra o terminal na pasta raíz do projeto, rode o seguinte comando:
  `node .`

- Um arquivo chamado `demostrativo-cdi.pdf` será automaticamente criado na raíz do projeto

## Sreenshots

https://user-images.githubusercontent.com/8760873/213458834-aae88845-79c1-4978-bd0d-159f5254e5af.mov

![image](https://user-images.githubusercontent.com/8760873/213461802-1c536da1-e507-4191-b4bc-2c62d07489ca.png)
