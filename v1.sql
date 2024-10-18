create table users
(
    id       int auto_increment
        primary key,
    username varchar(255) not null,
    password varchar(255) not null,
    constraint username
        unique (username)
);

create table sentiment_analysis_results
(
    id           int auto_increment
        primary key,
    user_id      int                                 null,
    text         text                                not null,
    polarity     float                               not null,
    subjectivity float                               not null,
    sentiment    varchar(50)                         not null,
    created_at   timestamp default CURRENT_TIMESTAMP null,
    constraint sentiment_analysis_results_ibfk_1
        foreign key (user_id) references users (id)
);

create index user_id
    on sentiment_analysis_results (user_id);