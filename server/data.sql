create table todo(
    id varchar(255) primary key,
    user_email varchar(255),
    title varchar(30),
    progess int,
    date varchar(300)
);

create table users(
    email varchar(255) primary key ,
    passwords varchar(255)
);