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


ALTER TABLE servico1
ADD CodCli int