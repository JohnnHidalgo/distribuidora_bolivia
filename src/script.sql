-- Created by Redgate Data Modeler (https://datamodeler.redgate-platform.com)
-- Last modification date: 2026-01-12 01:55:24.659

-- tables
-- Table: Account
CREATE TABLE Account (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    code varchar(20) NOT NULL,
    CenterCost_id integer NOT NULL,
    Elements_id integer NOT NULL,
    CONSTRAINT Account_CenterCost FOREIGN KEY (CenterCost_id)
    REFERENCES CenterCost (id),
    CONSTRAINT Account_Elements FOREIGN KEY (Elements_id)
    REFERENCES Elements (id)
);

-- Table: Assignment
CREATE TABLE Assignment (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    position integer NOT NULL,
    in_container double precision NOT NULL,
    out_container double precision NOT NULL,
    units double precision NOT NULL,
    container double precision NOT NULL,
    payment double precision NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    Provider_id integer NOT NULL,
    CONSTRAINT Assignment_Provider FOREIGN KEY (Provider_id)
    REFERENCES Provider (id)
);

-- Table: Car
CREATE TABLE Car (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    idCar double precision NOT NULL,
    license varchar(10) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL
);

-- Table: Category
CREATE TABLE Category (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL
);

-- Table: CategoryProvider
CREATE TABLE CategoryProvider (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    Provider_id integer NOT NULL,
    Category_id integer NOT NULL,
    CONSTRAINT CategoryProvider_Provider FOREIGN KEY (Provider_id)
    REFERENCES Provider (id),
    CONSTRAINT CategoryProvider_Category FOREIGN KEY (Category_id)
    REFERENCES Category (id)
);

-- Table: CenterCost
CREATE TABLE CenterCost (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL
);

-- Table: Client
CREATE TABLE Client (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    ClientGroup_id integer NOT NULL,
    CONSTRAINT Client_ClientGroup FOREIGN KEY (ClientGroup_id)
    REFERENCES ClientGroup (id)
);

-- Table: ClientGroup
CREATE TABLE ClientGroup (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    idCerca double precision NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL
);

-- Table: Container
CREATE TABLE Container (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    destare double precision NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL
);

-- Table: ContainerMovements
CREATE TABLE ContainerMovements (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    Container_id integer NOT NULL,
    Assignment_id integer NOT NULL,
    Request_id integer NOT NULL,
    CONSTRAINT ContainerMovements_Container FOREIGN KEY (Container_id)
    REFERENCES Container (id),
    CONSTRAINT ContainerMovements_Assignment FOREIGN KEY (Assignment_id)
    REFERENCES Assignment (id),
    CONSTRAINT ContainerMovements_Request FOREIGN KEY (Request_id)
    REFERENCES Request (id)
);

-- Table: Elements
CREATE TABLE Elements (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL
);

-- Table: Employee
CREATE TABLE Employee (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    document varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    Position_id integer NOT NULL,
    CONSTRAINT Employee_Position FOREIGN KEY (Position_id)
    REFERENCES Position (id)
);

-- Table: PaymentType
CREATE TABLE PaymentType (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL
);

-- Table: Position
CREATE TABLE Position (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL
);

-- Table: Product
CREATE TABLE Product (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    Category_id integer NOT NULL,
    CONSTRAINT Product_Category FOREIGN KEY (Category_id)
    REFERENCES Category (id)
);

-- Table: ProductAssignment
CREATE TABLE ProductAssignment (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    container integer NOT NULL,
    units integer NOT NULL,
    menudencia boolean NOT NULL,
    weight double precision NOT NULL,
    payment double precision NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    Product_id integer NOT NULL,
    Tickets_id integer NOT NULL,
    CONSTRAINT ProductAssignment_Product FOREIGN KEY (Product_id)
    REFERENCES Product (id),
    CONSTRAINT ProductAssignment_Tickets FOREIGN KEY (Tickets_id)
    REFERENCES Tickets (id)
);

-- Table: ProductRequest
CREATE TABLE ProductRequest (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    containers integer NOT NULL,
    units integer NOT NULL,
    menudencia boolean NOT NULL,
    weight double precision NOT NULL,
    payment double precision NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    Request_id integer NOT NULL,
    Product_id integer NOT NULL,
    CONSTRAINT ProductRequest_Request FOREIGN KEY (Request_id)
    REFERENCES Request (id),
    CONSTRAINT ProductRequest_Product FOREIGN KEY (Product_id)
    REFERENCES Product (id)
);

-- Table: Provider
CREATE TABLE Provider (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL
);

-- Table: Request
CREATE TABLE Request (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    position integer NOT NULL,
    in_container integer NOT NULL,
    out_container integer NOT NULL,
    units integer NOT NULL,
    container integer NOT NULL,
    payment double precision NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    Provider_id integer NOT NULL,
    Client_id integer NOT NULL,
    Car_id integer NOT NULL,
    Employee_id integer NOT NULL,
    CONSTRAINT Request_Provider FOREIGN KEY (Provider_id)
    REFERENCES Provider (id),
    CONSTRAINT Request_Client FOREIGN KEY (Client_id)
    REFERENCES Client (id),
    CONSTRAINT Request_Car FOREIGN KEY (Car_id)
    REFERENCES Car (id),
    CONSTRAINT Request_Employee FOREIGN KEY (Employee_id)
    REFERENCES Employee (id)
);

-- Table: RequestPaymentType
CREATE TABLE RequestPaymentType (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    PaymentType_id integer NOT NULL,
    Request_id integer NOT NULL,
    CONSTRAINT RequestPaymentType_PaymentType FOREIGN KEY (PaymentType_id)
    REFERENCES PaymentType (id),
    CONSTRAINT RequestPaymentType_Request FOREIGN KEY (Request_id)
    REFERENCES Request (id)
);

-- Table: RequestRequestState
CREATE TABLE RequestRequestState (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    RequestState_id integer NOT NULL,
    Request_id integer NOT NULL,
    CONSTRAINT RequestRequestState_RequestState FOREIGN KEY (RequestState_id)
    REFERENCES RequestState (id),
    CONSTRAINT RequestRequestState_Request FOREIGN KEY (Request_id)
    REFERENCES Request (id)
);

-- Table: RequestState
CREATE TABLE RequestState (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL
);

-- Table: RequestWeighing
CREATE TABLE RequestWeighing (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    weight double precision NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    ProductRequest_id integer NOT NULL,
    CONSTRAINT RequestWeighing_ProductRequest FOREIGN KEY (ProductRequest_id)
    REFERENCES ProductRequest (id)
);

-- Table: Role
CREATE TABLE Role (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL
);

-- Table: RoleTransaction
CREATE TABLE RoleTransaction (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    Transaction_id integer NOT NULL,
    Role_id integer NOT NULL,
    CONSTRAINT RoleTransaction_Transaction FOREIGN KEY (Transaction_id)
    REFERENCES "Transaction" (id),
    CONSTRAINT RoleTransaction_Role FOREIGN KEY (Role_id)
    REFERENCES Role (id)
);

-- Table: Salary
CREATE TABLE Salary (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    amount double NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    Employee_id integer NOT NULL,
    CONSTRAINT Salary_Employee FOREIGN KEY (Employee_id)
    REFERENCES Employee (id)
);

-- Table: Tickets
CREATE TABLE Tickets (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    code varchar(10) NOT NULL,
    deferred_payment boolean NOT NULL,
    payment double precision NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    Assignment_id integer NOT NULL,
    CONSTRAINT Tickets_Assignment FOREIGN KEY (Assignment_id)
    REFERENCES Assignment (id)
);

-- Table: TicketsWeighing
CREATE TABLE TicketsWeighing (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    weight double precision NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    Tickets_id integer NOT NULL,
    CONSTRAINT TicketsWeighing_Tickets FOREIGN KEY (Tickets_id)
    REFERENCES Tickets (id)
);

-- Table: Transaction
CREATE TABLE "Transaction" (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL
);

-- Table: User
CREATE TABLE User (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    username varchar(20) NOT NULL,
    password varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    Role_id integer NOT NULL,
    Client_id integer,
    Employee_id integer,
    CONSTRAINT User_Client FOREIGN KEY (Client_id)
    REFERENCES Client (id),
    CONSTRAINT User_Role FOREIGN KEY (Role_id)
    REFERENCES Role (id),
    CONSTRAINT User_Employee FOREIGN KEY (Employee_id)
    REFERENCES Employee (id)
);

-- Table: default
CREATE TABLE "default" (
    id integer NOT NULL CONSTRAINT id PRIMARY KEY,
    name varchar(20) NOT NULL,
    active boolean NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL
);

-- End of file.





-- =========================
-- INSERT SCRIPTS
-- =========================

INSERT INTO Account (
    name,
    active,
    created_at,
    updated_at,
    code,
    CenterCost_id,
    Elements_id
)
VALUES (
    $name,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $code,
    $CenterCost_id,
    $Elements_id
);

INSERT INTO Assignment (
    position,
    in_container,
    out_container,
    units,
    container,
    payment,
    active,
    created_at,
    updated_at,
    Provider_id
)
VALUES (
    $position,
    $in_container,
    $out_container,
    $units,
    $container,
    $payment,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $Provider_id
);

INSERT INTO Car (
    name,
    idCar,
    license,
    active,
    created_at,
    updated_at
)
VALUES (
    $name,
    $idCar,
    $license,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO Category (
    name,
    active,
    created_at,
    updated_at
)
VALUES (
    $name,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO CategoryProvider (
    active,
    created_at,
    updated_at,
    Provider_id,
    Category_id
)
VALUES (
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $Provider_id,
    $Category_id
);

INSERT INTO CenterCost (
    name,
    active,
    created_at,
    updated_at
)
VALUES (
    $name,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO ClientGroup (
    name,
    idCerca,
    active,
    created_at,
    updated_at
)
VALUES (
    $name,
    $idCerca,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO Client (
    name,
    active,
    created_at,
    updated_at,
    ClientGroup_id
)
VALUES (
    $name,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $ClientGroup_id
);

INSERT INTO Container (
    name,
    destare,
    active,
    created_at,
    updated_at
)
VALUES (
    $name,
    $destare,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO ContainerMovements (
    name,
    active,
    created_at,
    updated_at,
    Container_id,
    Assignment_id,
    Request_id
)
VALUES (
    $name,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $Container_id,
    $Assignment_id,
    $Request_id
);

INSERT INTO Elements (
    name,
    active,
    created_at,
    updated_at
)
VALUES (
    $name,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO Employee (
    name,
    document,
    active,
    created_at,
    updated_at,
    Position_id
)
VALUES (
    $name,
    $document,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $Position_id
);

INSERT INTO PaymentType (
    name,
    active,
    created_at,
    updated_at
)
VALUES (
    $name,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO Position (
    name,
    active,
    created_at,
    updated_at
)
VALUES (
    $name,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO Product (
    name,
    active,
    created_at,
    updated_at,
    Category_id
)
VALUES (
    $name,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $Category_id
);

INSERT INTO ProductAssignment (
    container,
    units,
    menudencia,
    weight,
    payment,
    active,
    created_at,
    updated_at,
    Product_id,
    Tickets_id
)
VALUES (
    $container,
    $units,
    $menudencia,
    $weight,
    $payment,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $Product_id,
    $Tickets_id
);

INSERT INTO ProductRequest (
    containers,
    units,
    menudencia,
    weight,
    payment,
    active,
    created_at,
    updated_at,
    Request_id,
    Product_id
)
VALUES (
    $containers,
    $units,
    $menudencia,
    $weight,
    $payment,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $Request_id,
    $Product_id
);

INSERT INTO Provider (
    name,
    active,
    created_at,
    updated_at
)
VALUES (
    $name,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO Request (
    position,
    in_container,
    out_container,
    units,
    container,
    payment,
    active,
    created_at,
    updated_at,
    Provider_id,
    Client_id,
    Car_id,
    Employee_id
)
VALUES (
    $position,
    $in_container,
    $out_container,
    $units,
    $container,
    $payment,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $Provider_id,
    $Client_id,
    $Car_id,
    $Employee_id
);

INSERT INTO RequestPaymentType (
    active,
    created_at,
    updated_at,
    PaymentType_id,
    Request_id
)
VALUES (
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $PaymentType_id,
    $Request_id
);

INSERT INTO RequestRequestState (
    active,
    created_at,
    updated_at,
    RequestState_id,
    Request_id
)
VALUES (
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $RequestState_id,
    $Request_id
);

INSERT INTO RequestState (
    name,
    active,
    created_at,
    updated_at
)
VALUES (
    $name,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO RequestWeighing (
    weight,
    active,
    created_at,
    updated_at,
    ProductRequest_id
)
VALUES (
    $weight,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $ProductRequest_id
);

INSERT INTO Role (
    name,
    active,
    created_at,
    updated_at
)
VALUES (
    $name,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO RoleTransaction (
    name,
    active,
    created_at,
    updated_at,
    Transaction_id,
    Role_id
)
VALUES (
    $name,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $Transaction_id,
    $Role_id
);

INSERT INTO Salary (
    amount,
    active,
    created_at,
    updated_at,
    Employee_id
)
VALUES (
    $amount,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $Employee_id
);

INSERT INTO Tickets (
    code,
    deferred_payment,
    payment,
    active,
    created_at,
    updated_at,
    Assignment_id
)
VALUES (
    $code,
    $deferred_payment,
    $payment,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $Assignment_id
);

INSERT INTO TicketsWeighing (
    weight,
    active,
    created_at,
    updated_at,
    Tickets_id
)
VALUES (
    $weight,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $Tickets_id
);

INSERT INTO Transaction (
    name,
    active,
    created_at,
    updated_at
)
VALUES (
    $name,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO User (
    username,
    password,
    active,
    created_at,
    updated_at,
    Role_id,
    Client_id,
    Employee_id
)
VALUES (
    $username,
    $password,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    $Role_id,
    $Client_id,
    $Employee_id
);

INSERT INTO "default" (
    name,
    active,
    created_at,
    updated_at
)
VALUES (
    $name,
    $active,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);








-- Account
SELECT * FROM Account
    WHERE  name=$name
    AND active=$active
    AND created_at=$created_at
    AND code=$code
    AND CenterCost_id=$CenterCost_id
    AND Elements_id=$Elements_id;

-- Assignment
SELECT * FROM Assignment
    WHERE  position=$position
    AND in_container=$in_container
    AND out_container=$out_container
    AND units=$units
    AND container=$container
    AND payment=$payment
    AND active=$active
    AND created_at=$created_at
    AND Provider_id=$Provider_id;

-- Car
SELECT * FROM Car
    WHERE  name=$name
    AND idCar=$idCar
    AND license=$license
    AND active=$active
    AND created_at=$created_at;

-- Category
SELECT * FROM Category
    WHERE  name=$name
    AND active=$active
    AND created_at=$created_at;

-- CategoryProvider
SELECT * FROM CategoryProvider
    WHERE  active=$active
    AND created_at=$created_at
    AND Provider_id=$Provider_id
    AND Category_id=$Category_id;

-- CenterCost
SELECT * FROM CenterCost
    WHERE  name=$name
    AND active=$active
    AND created_at=$created_at;

-- Client
SELECT * FROM Client
    WHERE  name=$name
    AND active=$active
    AND created_at=$created_at
    AND ClientGroup_id=$ClientGroup_id;

-- ClientGroup
SELECT * FROM ClientGroup
    WHERE  name=$name
    AND idCerca=$idCerca
    AND active=$active
    AND created_at=$created_at;

-- Container
SELECT * FROM Container
    WHERE  name=$name
    AND destare=$destare
    AND active=$active
    AND created_at=$created_at;

-- ContainerMovements
SELECT * FROM ContainerMovements
    WHERE  name=$name
    AND active=$active
    AND created_at=$created_at
    AND Container_id=$Container_id
    AND Assignment_id=$Assignment_id
    AND Request_id=$Request_id;

-- Elements
SELECT * FROM Elements
    WHERE  name=$name
    AND active=$active
    AND created_at=$created_at;

-- Employee
SELECT * FROM Employee
    WHERE  name=$name
    AND document=$document
    AND active=$active
    AND created_at=$created_at
    AND Position_id=$Position_id;

-- PaymentType
SELECT * FROM PaymentType
    WHERE  name=$name
    AND active=$active
    AND created_at=$created_at;

-- Position
SELECT * FROM Position
    WHERE  name=$name
    AND active=$active
    AND created_at=$created_at;

-- Product
SELECT * FROM Product
    WHERE  name=$name
    AND active=$active
    AND created_at=$created_at
    AND Category_id=$Category_id;

-- ProductAssignment
SELECT * FROM ProductAssignment
    WHERE  container=$container
    AND units=$units
    AND menudencia=$menudencia
    AND weight=$weight
    AND payment=$payment
    AND active=$active
    AND created_at=$created_at
    AND Product_id=$Product_id
    AND Tickets_id=$Tickets_id;

-- ProductRequest
SELECT * FROM ProductRequest
    WHERE  containers=$containers
    AND units=$units
    AND menudencia=$menudencia
    AND weight=$weight
    AND payment=$payment
    AND active=$active
    AND created_at=$created_at
    AND Request_id=$Request_id
    AND Product_id=$Product_id;

-- Provider
SELECT * FROM Provider
    WHERE  name=$name
    AND active=$active
    AND created_at=$created_at;

-- Request
SELECT * FROM Request
    WHERE  position=$position
    AND in_container=$in_container
    AND out_container=$out_container
    AND units=$units
    AND container=$container
    AND payment=$payment
    AND active=$active
    AND created_at=$created_at
    AND Provider_id=$Provider_id
    AND Client_id=$Client_id
    AND Car_id=$Car_id
    AND Employee_id=$Employee_id;

-- RequestPaymentType
SELECT * FROM RequestPaymentType
    WHERE  active=$active
    AND created_at=$created_at
    AND PaymentType_id=$PaymentType_id
    AND Request_id=$Request_id;

-- RequestRequestState
SELECT * FROM RequestRequestState
    WHERE  active=$active
    AND created_at=$created_at
    AND RequestState_id=$RequestState_id
    AND Request_id=$Request_id;

-- RequestState
SELECT * FROM RequestState
    WHERE  name=$name
    AND active=$active
    AND created_at=$created_at;

-- RequestWeighing
SELECT * FROM RequestWeighing
    WHERE  weight=$weight
    AND active=$active
    AND created_at=$created_at
    AND ProductRequest_id=$ProductRequest_id;

-- Role
SELECT * FROM Role
    WHERE  name=$name
    AND active=$active
    AND created_at=$created_at;

-- RoleTransaction
SELECT * FROM RoleTransaction
    WHERE  name=$name
    AND active=$active
    AND created_at=$created_at
    AND Transaction_id=$Transaction_id
    AND Role_id=$Role_id;

-- Salary
SELECT * FROM Salary
    WHERE  amount=$amount
    AND active=$active
    AND created_at=$created_at
    AND Employee_id=$Employee_id;

-- Tickets
SELECT * FROM Tickets
    WHERE  code=$code
    AND deferred_payment=$deferred_payment
    AND payment=$payment
    AND active=$active
    AND created_at=$created_at
    AND Assignment_id=$Assignment_id;

-- TicketsWeighing
SELECT * FROM TicketsWeighing
    WHERE  weight=$weight
    AND active=$active
    AND created_at=$created_at
    AND Tickets_id=$Tickets_id;

-- Transaction
SELECT * FROM Transaction
    WHERE  name=$name
    AND active=$active
    AND created_at=$created_at;

-- User
SELECT * FROM User
    WHERE  username=$username
    AND password=$password
    AND active=$active
    AND created_at=$created_at
    AND Role_id=$Role_id
    AND Client_id=$Client_id
    AND Employee_id=$Employee_id;

-- default
SELECT * FROM "default"
    WHERE  name=$name
    AND active=$active
    AND created_at=$created_at;

















