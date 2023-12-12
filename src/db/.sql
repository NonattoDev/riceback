ALTER TABLE servico
ADD Hora VARCHAR(5);

ALTER TABLE servico1
ADD Hora VARCHAR(5);

ALTER TABLE servico1
ADD CodFor int

ALTER TABLE Clientes
ADD Latitude VARCHAR(15),
    Longitude VARCHAR(15);

ALTER TABLE Clientes
ADD tokenVerificacao VARCHAR(10),  
    tokenData varchar(25);  


--Adicionar em Clientes um CODPRO (int)
ALTER TABLE Clientes
ADD CodPro1 int,
    CodPro2 int,
    CodPro3 int,
    CodPro4 int,
    CodPro5 int,
    CodPro6 int;


-- Cria Preco e Percentual 
ALTER TABLE servico1
ADD Preco decimal(10,2),
    Percentual decimal(10,2);

ALTER TABLE Clientes
ADD Preco decimal(10,2),
    Percentual1 decimal(10,2);
    Preco2 decimal(10,2),
    Percentual2 decimal(10,2);
    Preco3 decimal(10,2),
    Percentual3 decimal(10,2);
    Preco4 decimal(10,2),
    Percentual4 decimal(10,2);
    Preco5 decimal(10,2),
    Percentual5 decimal(10,2);


-- Adiciona um valor para todos os Preco e Percentual em Clientes
UPDATE Clientes
SET Preco = 10.00,
    Percentual = 20.00;


--Transforma todos os CodPro do banco em 1
UPDATE Clientes
SET CodPro1 = 1
WHERE CodPro IS NULL;


ALTER TABLE servico1
ADD CodCli int