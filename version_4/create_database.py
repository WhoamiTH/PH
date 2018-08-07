import pymysql
import numpy as np

db = pymysql.connect("localhost", "root", "123456", "precision_health")

cursor = db.cursor()

# sql_food = """
# CREATE TABLE food_content_and_nutrition (
# code INT NOT NULL,
# person_id INT NOT NULL,
# time_id CHAR(20) NOT NULL,
# cholesterol FLOAT NOT NULL,
# salt FLOAT NOT NULL,
# sugar FLOAT NOT NULL,
# calories FLOAT NOT NULL,
# no_fresh FLOAT NOT NULL,
# caffeine FLOAT NOT NULL,
# oily FLOAT NOT NULL,
# snacks FLOAT NOT NULL,
# nutrient_rich_food FLOAT NOT NULL,
# fiber FLOAT NOT NULL,
# vegetales FLOAT NOT NULL,
# water FLOAT NOT NULL,
# fluid_balance FLOAT NOT NULL
# )
# """
# cursor.execute(sql_food)

# sql_unhealthy = """
# CREATE TABLE unhealthy_habits (
# code INT NOT NULL,
# person_id INT NOT NULL,
# time_id CHAR(20) NOT NULL,
# alcoholic_beverages FLOAT NOT NULL,
# tobacco FLOAT NOT NULL,
# drug FLOAT NOT NULL
# )
# """
# cursor.execute(sql_unhealthy)

# sql_sensory = """
# CREATE TABLE sensory_appeal (
# code INT NOT NULL,
# person_id INT NOT NULL,
# time_id CHAR(20) NOT NULL,
# visual_appearance FLOAT NOT NULL,
# in_mouth_taste FLOAT NOT NULL,
# flavour FLOAT NOT NULL,
# oder FLOAT NOT NULL
# )
# """
# cursor.execute(sql_sensory)

# sql_social = """
# CREATE TABLE social_factors (
# code INT NOT NULL,
# person_id INT NOT NULL,
# time_id CHAR(20) NOT NULL,
# availability_converience FLOAT NOT NULL,
# affordability_price_time FLOAT NOT NULL,
# label FLOAT NOT NULL,
# brand FLOAT NOT NULL,
# peer_group_influence FLOAT NOT NULL,
# social_class FLOAT NOT NULL,
# knowledge FLOAT NOT NULL
# )
# """
# cursor.execute(sql_social)

# sql_psychological = """
# CREATE TABLE diet_psychological_features (
# code INT NOT NULL,
# person_id INT NOT NULL,
# time_id CHAR(20) NOT NULL,
# attitude_belief FLOAT NOT NULL,
# risk_expectation FLOAT NOT NULL,
# need_urgency FLOAT NOT NULL,
# habitual_addiction FLOAT NOT NULL,
# sociao_cultural_ethical_values FLOAT NOT NULL,
# familiarity FLOAT NOT NULL,
# inntention_motivation FLOAT NOT NULL
# )
# """
# cursor.execute(sql_psychological)

# sql_disease = """
# CREATE TABLE related_diseases (
# code INT NOT NULL,
# person_id INT NOT NULL,
# time_id CHAR(20) NOT NULL,
# diabetes FLOAT NOT NULL,
# hypertension FLOAT NOT NULL,
# obesity FLOAT NOT NULL
# )
# """
# cursor.execute(sql_disease)

# sql_symptoms = """
# CREATE TABLE related_symptoms (
# code INT NOT NULL,
# person_id INT NOT NULL,
# time_id CHAR(20) NOT NULL,
# breathlessness FLOAT NOT NULL,
# shortness_of_breath FLOAT NOT NULL,
# middle_of_night_short_of_breath FLOAT NOT NULL,
# irregular_rapid_Heartbeat FLOAT NOT NULL,
# persistent_cough FLOAT NOT NULL,
# coughing_up_Pick_foam_mucus FLOAT NOT NULL,
# chest_pain FLOAT NOT NULL,
# fatigue_weakness FLOAT NOT NULL,
# oedema FLOAT NOT NULL,
# ascites FLOAT NOT NULL,
# increased_need_to_urinate_at_night FLOAT NOT NULL,
# difficulties_concentrating FLOAT NOT NULL,
# lack_of_appetite_nausea FLOAT NOT NULL,
# sudden_loss_gain_weight FLOAT NOT NULL
# )
# """
# cursor.execute(sql_symptoms)


# sql_service = """
# CREATE TABLE medical_service (
# code INT NOT NULL,
# person_id INT NOT NULL,
# time_id CHAR(20) NOT NULL,
# availability_converience FLOAT NOT NULL,
# affordability_price_time FLOAT NOT NULL,
# trust_authority FLOAT NOT NULL
# )
# """
# cursor.execute(sql_service)

# sql_body = """
# CREATE TABLE body_factors (
# code INT NOT NULL,
# person_id INT NOT NULL,
# time_id CHAR(20) NOT NULL,
# BMI FLOAT NOT NULL,
# gender FLOAT NOT NULL,
# ethnicity FLOAT NOT NULL,
# family_history FLOAT NOT NULL,
# physical_disease_checkup FLOAT NOT NULL,
# body_wellness_signs FLOAT NOT NULL
# )
# """
# cursor.execute(sql_body)

# sql_physical = """
# CREATE TABLE physical_exercise (
# code INT NOT NULL,
# person_id INT NOT NULL,
# time_id CHAR(20) NOT NULL,
# availability_converience FLOAT NOT NULL,
# affordability_price_time FLOAT NOT NULL,
# mood FLOAT NOT NULL,
# peer_group_pressure FLOAT NOT NULL,
# social_class FLOAT NOT NULL,
# motivation FLOAT NOT NULL
# )
# """
# cursor.execute(sql_physical)

# sql_psychological_features = """
# CREATE TABLE psychological_features (
# code INT NOT NULL,
# person_id INT NOT NULL,
# time_id CHAR(20) NOT NULL,
# attitude_belief FLOAT NOT NULL,
# risk_expectation FLOAT NOT NULL,
# need_urgency FLOAT NOT NULL,
# anxiety_depression FLOAT NOT NULL,
# stress FLOAT NOT NULL,
# social_isolation FLOAT NOT NULL,
# poverty_financial FLOAT NOT NULL,
# peer_group_influence FLOAT NOT NULL
# )
# """
# cursor.execute(sql_psychological_features)



sql_threshold = """
CREATE TABLE threshold (
code INT NOT NULL,
name CHAR(100) NOT NULL,
low FLOAT NOT NULL,
high FLOAT NOT NULL,
harm FLOAT NOT NULL
)
"""
cursor.execute(sql_threshold)

db.close()

