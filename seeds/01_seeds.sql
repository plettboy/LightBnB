
INSERT INTO users (name, email, password) 
VALUES ('Mike', 'mike@mike.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Jon', 'jon@jon.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Ron', 'ron@ron.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, province, city, street, post_code, active)
VALUES (1, 'title', 'description', 'http://google.com', 'http://google.com', 550, 2, 5, 5, 'Canada', 'Ontario', 'Ottawa', '401 Bank St.', 'K0K3W0', TRUE),
(1, 'title', 'description', 'http://google.com', 'http://google.com', 550, 2, 5, 5, 'Canada', 'Ontario', 'Ottawa', '402 Bank St.', 'K0K3W0', TRUE);
(1, 'title', 'description', 'http://google.com', 'http://google.com', 550, 2, 5, 5, 'Canada', 'Ontario', 'Ottawa', '403 Bank St.', 'K0K3W0', TRUE),

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 1),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 3, 3);


INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 1, 1, 8, 'messages'),
(3, 2, 2, 10, 'messages'),
(2, 3, 3, 9, 'messages');