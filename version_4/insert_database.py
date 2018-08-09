import pymysql
import numpy as np

db = pymysql.connect("localhost", "ph", "123456", "precision_health")

cursor = db.cursor()

data = np.loadtxt('data.csv', dtype=np.str, delimiter=',', skiprows=1)
print(data.shape)
code_list = data[:,0]
code_list = code_list.astype(np.int)
code_list = code_list.tolist()

person_id_list = data[:,1]
person_id_list = person_id_list.astype(np.int)
person_id_list = person_id_list.tolist()

time_id_list = data[:,2]
time_id_list = time_id_list.tolist()



food_list = data[:,3:16]
food_list = food_list.astype(np.float)
food_list = food_list.tolist()

unhealthy_list = data[:,16:19]
unhealthy_list = unhealthy_list.astype(np.float)
unhealthy_list = unhealthy_list.tolist()

sensory_list = data[:,19:23]
sensory_list = sensory_list.astype(np.float)
sensory_list = sensory_list.tolist()

social_list = data[:,23:30]
social_list = social_list.astype(np.float)
social_list = social_list.tolist()

diet_psychological_features_list = data[:,30:37]
diet_psychological_features_list = diet_psychological_features_list.astype(np.float)
diet_psychological_features_list = diet_psychological_features_list.tolist()

disease_list = data[:,37:40]
disease_list = disease_list.astype(np.float)
disease_list = disease_list.tolist()

symptoms_list = data[:,40:54]
symptoms_list = symptoms_list.astype(np.float)
symptoms_list = symptoms_list.tolist()

service_list = data[:,54:57]
service_list = service_list.astype(np.float)
service_list = service_list.tolist()

body_list = data[:,57:63]
body_list = body_list.astype(np.float)
body_list = body_list.tolist()

exercise_list = data[:,63:69]
exercise_list = exercise_list.astype(np.float)
exercise_list = exercise_list.tolist()

psychological_list = data[:,69:77]
psychological_list = psychological_list.astype(np.float)
psychological_list = psychological_list.tolist()


length = len(code_list)

print('start food')
for i in range(length):
	if i % 100 == 0:
		print(i)
	code = code_list[i]
	person_id = person_id_list[i]
	time_id = time_id_list[i]
	item = food_list[i]
	cholesterol = item[0]
	salt = item[1]
	sugar = item[2]
	calories = item[3]
	no_fresh = item[4]
	caffeine = item[5]
	oily = item[6]
	snacks = item[7]
	nutrient_rich_food = item[8]
	fiber = item[9]
	vegetales = item[10]
	water = item[11]
	fluid_balance = item[12]
	sql_food_insert ="INSERT INTO food_content_and_nutrition (code,person_id,time_id,\
	cholesterol,salt,sugar,calories,no_fresh,caffeine,oily,snacks,\
	nutrient_rich_food,fiber,vegetales,water,fluid_balance)\
	VALUES ('%d', '%d', '%s', '%f','%f','%f','%f','%f','%f','%f','%f','%f','%f','%f','%f','%f')"%(code,person_id,time_id,\
	cholesterol,salt,sugar,calories,no_fresh,caffeine,oily,snacks,\
	nutrient_rich_food,fiber,vegetales,water,fluid_balance)
	cursor.execute(sql_food_insert)
        db.commit()
print('complete food')

# print('start unhealthy')
# for i in range(length):
# 	if i % 100 == 0:
# 		print(i)
# 	code = code_list[i]
# 	person_id = person_id_list[i]
# 	time_id = time_id_list[i]
# 	item = unhealthy_list[i]
# 	alcoholic_beverages = item[0]
# 	tobacco = item[1]
# 	drug = item[2]
# 	sql_unhealthy_insert = "INSERT INTO unhealthy_habits (code,person_id,time_id,\
# 	alcoholic_beverages,tobacco,drug)\
# 	VALUES ({0}, {1}, {2}, {3}, {4}, {5})".format(code,person_id,time_id,\
# 	alcoholic_beverages,tobacco,drug)
# 	cursor.execute(sql_unhealthy_insert)
# 	db.commit()
# print('complete unhealthy')

# print('start sensory')
# for i in range(length):
# 	if i % 100 == 0:
# 		print(i)
# 	code = code_list[i]
# 	person_id = person_id_list[i]
# 	time_id = time_id_list[i]
# 	item = sensory_list[i]
# 	visual_appearance = item[0]
# 	in_mouth_taste = item[1]
# 	flavour = item[2]
# 	oder = item[3]
# 	sql_sensory_insert ="INSERT INTO sensory_appeal (code,person_id,time_id,\
# 	visual_appearance,in_mouth_taste,flavour,oder)\
# 	VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6})".format(code,person_id,time_id,\
# 	visual_appearance,in_mouth_taste,flavour,oder)
# 	cursor.execute(sql_sensory_insert)
# 	db.commit()
# print('complete')


# print('start social')
# for i in range(length):
# 	if i % 100 == 0:
# 		print(i)
# 	code = code_list[i]
# 	person_id = person_id_list[i]
# 	time_id = time_id_list[i]
# 	item = social_list[i]
# 	availability_converience = item[0]
# 	affordability_price_time = item[1]
# 	label = item[2]
# 	brand = item[3]
# 	peer_group_influence = item[4]
# 	social_class = item[5]
# 	knowledge = item[6]
# 	sql_social_insert ="INSERT INTO social_factors (code,person_id,time_id,\
# 	availability_converience,affordability_price_time,label,\
# 	brand,peer_group_influence,social_class,knowledge)\
# 	VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9})".format(code,person_id,time_id,\
# 	availability_converience,affordability_price_time,label,\
# 	brand,peer_group_influence,social_class,knowledge)
# 	cursor.execute(sql_social_insert)
# 	db.commit()
# print('complete')

# print('start diet_psychological_features')
# for i in range(length):
# 	if i % 100 == 0:
# 		print(i)
# 	code = code_list[i]
# 	person_id = person_id_list[i]
# 	time_id = time_id_list[i]
# 	item = diet_psychological_features_list[i]
# 	attitude_belief = item[0]
# 	risk_expectation = item[1]
# 	need_urgency = item[2]
# 	habitual_addiction = item[3]
# 	sociao_cultural_ethical_values = item[4]
# 	familiarity = item[5]
# 	inntention_motivation = item[6]
# 	sql_diet_psychological_features_insert ="INSERT INTO diet_psychological_features (code,person_id,time_id,\
# 	attitude_belief,risk_expectation,need_urgency,habitual_addiction,\
# 	sociao_cultural_ethical_values,familiarity,inntention_motivation)\
# 	VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9})".format(code,person_id,time_id,\
# 	attitude_belief,risk_expectation,need_urgency,habitual_addiction,\
# 	sociao_cultural_ethical_values,familiarity,inntention_motivation)
# 	cursor.execute(sql_diet_psychological_features_insert)
# 	db.commit()
# print('complete')


# print('start disease')
# for i in range(length):
# 	if i % 100 == 0:
# 		print(i)
# 	code = code_list[i]
# 	person_id = person_id_list[i]
# 	time_id = time_id_list[i]
# 	item = disease_list[i]
# 	diabetes = item[0]
# 	hypertension = item[1]
# 	obesity = item[2]
# 	sql_diseases_insert ="INSERT INTO related_diseases (code,person_id,time_id,\
# 	diabetes,hypertension,obesity)\
# 	VALUES ({0}, {1}, {2}, {3}, {4}, {5})".format(code,person_id,time_id,\
# 	diabetes,hypertension,obesity)
# 	cursor.execute(sql_diseases_insert)
# 	db.commit()
# print('complete')


# print('start symptoms')
# for i in range(length):
# 	if i % 100 == 0:
# 		print(i)
# 	code = code_list[i]
# 	person_id = person_id_list[i]
# 	time_id = time_id_list[i]
# 	item = symptoms_list[i]
# 	breathlessness = item[0]
# 	shortness_of_breath = item[1]
# 	middle_of_night_short_of_breath = item[2]
# 	irregular_rapid_Heartbeat = item[3]
# 	persistent_cough = item[4]
# 	coughing_up_Pick_foam_mucus = item[5]
# 	chest_pain = item[6]
# 	fatigue_weakness = item[7]
# 	oedema = item[8]
# 	ascites = item[9]
# 	increased_need_to_urinate_at_night = item[10]
# 	difficulties_concentrating = item[11]
# 	lack_of_appetite_nausea = item[12]
# 	sudden_loss_gain_weight = item[13]
# 	sql_symptoms_insert ="INSERT INTO related_symptoms (code,person_id,time_id,\
# 	breathlessness,shortness_of_breath,middle_of_night_short_of_breath,\
# 	irregular_rapid_Heartbeat,persistent_cough,coughing_up_Pick_foam_mucus,\
# 	chest_pain,fatigue_weakness,oedema,ascites,increased_need_to_urinate_at_night,\
# 	difficulties_concentrating,lack_of_appetite_nausea,sudden_loss_gain_weight)\
# 	VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}, {10}, {11}, {12}, {13}, {14}, {15}, {16})".format(code,person_id,time_id,\
# 	breathlessness,shortness_of_breath,middle_of_night_short_of_breath,\
# 	irregular_rapid_Heartbeat,persistent_cough,coughing_up_Pick_foam_mucus,\
# 	chest_pain,fatigue_weakness,oedema,ascites,increased_need_to_urinate_at_night,\
# 	difficulties_concentrating,lack_of_appetite_nausea,sudden_loss_gain_weight)
# 	cursor.execute(sql_symptoms_insert)
# 	db.commit()
# print('complete')


# print('start service')
# for i in range(length):
# 	if i % 100 == 0:
# 		print(i)
# 	code = code_list[i]
# 	person_id = person_id_list[i]
# 	time_id = time_id_list[i]
# 	item = service_list[i]
# 	availability_converience = item[0]
# 	affordability_price_time = item[1]
# 	trust_authority = item[2]
# 	sql_service_insert ="INSERT INTO medical_service (code,person_id,time_id,\
# 	availability_converience,affordability_price_time,trust_authority)\
# 	VALUES ({0}, {1}, {2}, {3}, {4}, {5})".format(code,person_id,time_id,\
# 	availability_converience,affordability_price_time,trust_authority)
# 	cursor.execute(sql_service_insert)
# 	db.commit()
# print('complete')



# print('start body')
# for i in range(length):
# 	if i % 100 == 0:
# 		print(i)
# 	code = code_list[i]
# 	person_id = person_id_list[i]
# 	time_id = time_id_list[i]
# 	item = body_list[i]
# 	BMI = item[0]
# 	gender = item[1]
# 	ethnicity = item[2]
# 	family_history = item[3]
# 	physical_disease_checkup = item[4]
# 	body_wellness_signs = item[5]
# 	sql_body_insert ="INSERT INTO body_factors (code,person_id,time_id,\
# 	BMI,gender,ethnicity,family_history,physical_disease_checkup,body_wellness_signs)\
# 	VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8})".format(code,person_id,time_id,\
# 	BMI,gender,ethnicity,family_history,physical_disease_checkup,body_wellness_signs)
# 	cursor.execute(sql_body_insert)
# 	db.commit()
# print('complete')

# print('start exercise')
# for i in range(length):
# 	if i % 100 == 0:
# 		print(i)
# 	code = code_list[i]
# 	person_id = person_id_list[i]
# 	time_id = time_id_list[i]
# 	item = exercise_list[i]
# 	availability_converience = item[0]
# 	affordability_price_time = item[1]
# 	mood = item[2]
# 	peer_group_pressure = item[3]
# 	social_class = item[4]
# 	motivation = item[5]
# 	sql_exercise_insert ="INSERT INTO physical_exercise (code,person_id,time_id,\
# 	availability_converience,affordability_price_time,mood,peer_group_pressure,\
# 	social_class,motivation)\
# 	VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8})".format(code,person_id,time_id,\
# 	availability_converience,affordability_price_time,mood,peer_group_pressure,\
# 	social_class,motivation)
# 	cursor.execute(sql_exercise_insert)
# 	db.commit()
# print('complete')


# print('start psychological')
# for i in range(length):
# 	if i % 100 == 0:
# 		print(i)
# 	code = code_list[i]
# 	person_id = person_id_list[i]
# 	time_id = time_id_list[i]
# 	item = psychological_list[i]
# 	attitude_belief = item[0]
# 	risk_expectation = item[1]
# 	need_urgency = item[2]
# 	anxiety_depression = item[3]
# 	stress = item[4]
# 	social_isolation = item[5]
# 	poverty_financial = item[6]
# 	peer_group_influence = item[7]
# 	sql_psychological_features_insert ="INSERT INTO psychological_features (code,person_id,time_id,\
# 	attitude_belief,risk_expectation,need_urgency,anxiety_depression,stress,\
# 	social_isolation,poverty_financial,peer_group_influence)\
# 	VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}, {10})".format(code,person_id,time_id,\
# 	attitude_belief,risk_expectation,need_urgency,anxiety_depression,stress,\
# 	social_isolation,poverty_financial,peer_group_influence)
# 	cursor.execute(sql_psychological_features_insert)
# 	db.commit()
# print('complete')

# threshold = np.loadtxt('threshold.csv', dtype=np.str, delimiter=',', skiprows=1)
# num = threshold.shape[0]


# Code = threshold[:,0]
# Code = Code.astype(np.int)
# Code = Code.tolist()

# Name = threshold[:,1]
# Name = Name.tolist()

# Low = threshold[:,2]
# Low = Low.astype(np.float)
# Low = Low.tolist()

# High = threshold[:,3]
# High = High.astype(np.float)
# High = High.tolist()

# Harm = threshold[:,4]
# Harm = Harm.astype(np.float)
# Harm = Harm.tolist()
# print('start threshold')
# for i in range(num):
# 	code = Code[i]
# 	name = Name[i]
# 	low = Low[i]
# 	high = High[i]
# 	harm = Harm[i]
# 	sql_threshold_insert = "INSERT INTO threshold (code,name,low,high,harm)\
# 	VALUES ('%f','%s','%f','%f','%f')"%\
# 	(code,name,low,high,harm)
# 	cursor.execute(sql_threshold_insert)
# 	db.commit()
# print('complete')

db.close()

