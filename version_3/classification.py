import numpy as np
import random
import csv

def loadData(file_name):
	# tem = np.loadtxt(file_name, dtype=np.str, delimiter=',', skiprows=1)
	# tem_data = tem[:, 1:]
	# data = tem_data.astype(np.float)
	data = np.loadtxt(file_name, dtype=np.str, delimiter=',', skiprows=1)
	return data


def class_zero(value):
	if value != 0:
		return 1
	else:
		return 0


def class_nega_one(value, low_bond):
	if value < low_bond:
		return 1
	else:
		return 0


def class_general(value, threshold):
	if value > threshold[0] and value < threshold[1]:
		return 0
	else:
		return 1



def transform_element(element, threshold):
	# print(threshold)
	if threshold[1] == 0:
		return class_zero(element)
	elif threshold[1] == -1:
		return class_nega_one(element, threshold[0])
	elif threshold[1] == 1:
		return class_zero(element)
	else:
		return class_general(element, threshold)


def transform_data(data, threshold):
	new_data = []
	for element_pos in range(len(data)):
		new_element = transform_element(data[element_pos],threshold[element_pos])
		new_data.append(new_element)
	return new_data


def init_feature_list():
	#----------------------------------integrated knowledge about threat------------------------------------------------
	ikt_diet_food_nutrition = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	ikt_diet_unhealthy_habits = [13, 14, 15]
	ikt_medical_elements_diseases_related = [34, 35, 36]
	ikt_medical_elements_symptoms_related = [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
	ikt_physical_factors_body_factors = [54, 55, 56, 57, 58, 59]
	ikt_diet = [ikt_diet_food_nutrition,ikt_diet_unhealthy_habits]
	ikt_medical_elements = [ikt_medical_elements_diseases_related, ikt_medical_elements_symptoms_related]
	ikt_physical_factors = [ikt_physical_factors_body_factors]
	ikt = [ikt_diet, ikt_medical_elements, ikt_physical_factors]
	#----------------------------------psychological perspective--------------------------------------------------------
	psyper_diet_sensory_appeal = [16,17,18,19]
	psyper_diet_social = [22,23,24,25,26]
	psyper_diet_psychological_elements = [27,28,29,30,31,32,33]
	psyper_pysical_factors_physical_exercise = [62,63,64]
	psyper_psychological_elements_psychological_elements = [66,67,68,69,70,71,72,73]
	psyper_diet = [psyper_diet_sensory_appeal, psyper_diet_social, psyper_diet_psychological_elements]
	psyper_physical_factors = [psyper_pysical_factors_physical_exercise]
	psyper_psychological_elements = [psyper_psychological_elements_psychological_elements]
	psyper = [psyper_diet, psyper_physical_factors, psyper_psychological_elements]
	#-----------------------------------constraints---------------------------------------------------------------------
	constraints_resources_diet = [20,21]
	constraints_resources_medical_services = [51,52]
	constraints_resources_physical_exercise = [60,61]
	constraints_diet_food = [0,1,2,3,5,6,7]
	constraints_diet_unhealthy_habits = [13,14,15]
	constraints_diet_sensory_appeal = [16,17,18,19]
	constraints_diet_social = [22,23,24,25]
	constraints_diet_psychological_elements = [27,30,31,32,33]
	constraints_psychological_elements_psychological_elements = [66,71,72,73]
	constraints_resources = [constraints_resources_diet, constraints_resources_medical_services, constraints_resources_physical_exercise]
	constraints_diet = [constraints_diet_food, constraints_diet_unhealthy_habits, constraints_diet_sensory_appeal, constraints_diet_social, constraints_diet_psychological_elements]
	constraints_psychological_elements = [constraints_psychological_elements_psychological_elements]
	constraints = [constraints_resources, constraints_diet, constraints_psychological_elements]
	#------------------------------------motivation---------------------------------------------------------------------
	motivation_diet_psychological_elements = [27,28,29,30,31,32,33]
	motivation_medical_elements_medical_services = [53]
	motivation_physical_factors_physical_exercise = [65]
	motivation_psychological_elements_psychological_elements = [66,67,68,72,73]
	motivation_diet = [motivation_diet_psychological_elements]
	motivation_medical_elements = [motivation_medical_elements_medical_services]
	motivation_physical_factors = [motivation_physical_factors_physical_exercise]
	motivation_phychological_elements = [motivation_psychological_elements_psychological_elements]
	motivation = [motivation_diet, motivation_medical_elements, motivation_physical_factors, motivation_phychological_elements]
	return ikt, psyper, constraints, motivation


def init_label():
	# ----------------------------------integrated knowledge about threat------------------------------------------------
	ikt_diet = {1:'food_nutrition', 2:'unhealthy_habits','food_nutrition':1, 'unhealthy_habits':2}
	ikt_medical_elements = { 1:'diseases_related', 2:'symptoms_related', 'diseases_related':1, 'symptoms_related':2}
	ikt_physical_factors = { 1:'body_factors', 'body_factors':1}
	ikt = {1:'ikt_diet', 2:'ikt_medical_elements', 3:'ikt_physical_factors',10:ikt_diet,20:ikt_medical_elements,30:ikt_physical_factors, 'ikt_diet':1, 'ikt_medical_elements':2, 'ikt_physical_factors':3}
	# ----------------------------------psychological perspective--------------------------------------------------------
	psyper_diet = {1:'sensory_appeal', 2:'social', 3:'psychological_elements','sensory_appeal':1, 'social':2, 'psychological_elements':3}
	psyper_physical_factors = {1:'physical_exercise','physical_exercise':1}
	psyper_psychological_elements = {1:'psychological_elements', 'psychological_elements':1}
	psyper = {1:'psyper_diet', 2:'psyper_physical_factors', 3:'psyper_psychological_elements',10:psyper_diet,20:psyper_physical_factors,30:psyper_psychological_elements, 'psyper_diet':1, 'psyper_physical_factors':2, 'psyper_psychological_elements':3}
	# -----------------------------------constraints---------------------------------------------------------------------
	constraints_resources = {1:'diet', 2:'medical_services',
							 3:'physical_exercise','diet':1, 'medical_services':2,
							 'physical_exercise':3}
	constraints_diet = {1:'food', 2:'unhealthy_habits', 3:'sensory_appeal',
						4:'social', 5:'psychological_elements','food':1, 'unhealthy_habits':2, 'sensory_appeal':3,
						'social':4, 'psychological_elements':5}
	constraints_psychological_elements = {1:'psychological_elements','psychological_elements':1}
	constraints = {1:'constraints_resources', 2:'constraints_diet', 3:'constraints_psychological_elements',10:constraints_resources,20:constraints_diet,30:constraints_psychological_elements, 'constraints_resources':1, 'constraints_diet':2, 'constraints_psychological_elements':3}
	# ------------------------------------motivation---------------------------------------------------------------------
	motivation_diet = {1:'psychological_elements','psychological_elements':1}
	motivation_medical_elements = {1:'medical_services','medical_services':1}
	motivation_physical_factors = {1:'physical_exercise','physical_exercise':1}
	motivation_psychological_elements = {1:'psychological_elements', 'psychological_elements':1}
	motivation = {1:'diet', 2:'medical_elements', 3:'physical_factors',
				  4:'phychological_elements',10:motivation_diet,20:motivation_medical_elements,30:motivation_physical_factors, 40:motivation_psychological_elements, 'diet':1, 'medical_elements':2, 'physical_factors':3,
				  'phychological_elements':4}
	return ikt, psyper, constraints, motivation


def init_feature_name(filename):
	tem = np.loadtxt(filename, dtype=np.str, delimiter=',', skiprows=1)
	tem_data = tem[:, 0]
	feature_name = dict()
	for i in range(tem_data.shape[0]):
		feature_name[i] = tem_data[i]
	item = dict()
	for element in feature_name:
		item[feature_name[element]] = element
	for element in item:
		feature_name[element] = item[element]
	return feature_name


def group(data):
	group_data = []
	for i in range(100):
		h = (i+1)*100
		group_data.append(data[i*100:h,:])
	return group_data




def transform_vector(new_data, test_process, vector):
	for element in test_process:
		if isinstance(element, list):
			transform_vector(new_data, element,vector)
		else:
			if new_data[element] == 1:
				vector[element] = 1


def print_label(label_list, vector, feature_name):
	for i in label_list:
		if vector[i] == 1:
			print(feature_name[i])

def print_vector(vector, feature_name):
	for i in range(len(vector)):
		if vector[i] == 1:
			print(feature_name[i])


def print_unhealthy_feature(process_label, label_list, vector, feature_name):
	for element in process_label:
		if isinstance(process_label[element], str):
			print(process_label[element])
			if element*10 in process_label:
				print_unhealthy_feature(process_label[element*10], label_list[process_label[process_label[element]]-1], vector, feature_name)
			else:
				print_label(label_list[process_label[process_label[element]]-1], vector, feature_name)


def vector_and(vector_1, vector_2):
	length = len(vector_1)
	for i in range(length):
		if vector_1[i] == 0 or vector_2[i] == 0:
			vector_1[i] = 0
	return vector_1


def vector_or(vector_1, vector_2):
	length = len(vector_1)
	for i in range(length):
		if vector_1[i] == 1 or vector_2[i] == 1:
			vector_1[i] = 1
	return vector_1


def person_current_state_suggestion(person_data, ikt, psyper, constraints, motivation, ikt_label, psyper_label, constraints_label, motivation_label):
	ikt_vector = [0 for i in range(feature_number)]
	psyper_vector = [0 for i in range(feature_number)]
	constraints_vector = [0 for i in range(feature_number)]
	motivation_vector = [0 for i in range(feature_number)]

	transform_vector(person_data, ikt, ikt_vector)
	transform_vector(person_data, psyper, psyper_vector)
	transform_vector(person_data, constraints, constraints_vector)
	transform_vector(person_data, motivation, motivation_vector)

	print('integrated knowledge about threat')
	print_unhealthy_feature(ikt_label, ikt, ikt_vector, feature_name)
	print('psychological impacts')
	print_unhealthy_feature(psyper_label, psyper, psyper_vector, feature_name)
	print('constraints')
	print_unhealthy_feature(constraints_label, constraints, constraints_vector, feature_name)
	print('motivation')
	print_unhealthy_feature(motivation_label, motivation, motivation_vector, feature_name)

	perceived_vector = vector_or(ikt_vector, psyper_vector)
	motivation_and_constrains = vector_and(motivation_vector, constraints_vector)
	result_vector = vector_and(perceived_vector, motivation_and_constrains)
	print('-------------------------------------------------------------------------------')
	print_vector(result_vector, feature_name)




def draw_curve(feature_value, lower, upper,name):
	plt.clf()
	x = [i for i in range(100)]
	plt.plot(x, feature_value, label='data')
	if upper == 0:
		plt.hlines(0, 0, 100, colors='red', label='upper')
	elif upper == -1:
		plt.hlines(lower,0,100,colors='green', label='lower')
	elif upper == 1:
		plt.hlines(upper, 0, 100, colors='red', label='upper')
		plt.hlines(lower, 0, 100, colors='green', label='lower')
	else:
		plt.hlines(upper, 0, 100, colors='red', label='upper')
		plt.hlines(lower, 0, 100, colors='green', label='lower')


	plt.xlabel('time')
	plt.ylabel('value')
	plt.title(name)
	plt.legend(loc='upper left')
	plt.savefig(name + '.pdf')



def id_list():
    data_name = "data.csv"
    data = loadData(data_name)
    data = data[:,0]
    data = data.astype(np.int)
    ID_list = list(set(data))
    ID_list = sorted(ID_list)
    print(type(ID_list))
    print(ID_list)
    return ID_list

def feature_name(offset):
    data_name = "data.csv"
    threshold_name = "threshold.csv"
    feature_number = 74
    data = loadData(data_name)
    threshold = loadData(threshold_name)
    threshold = threshold[:, 1:]
    threshold = threshold.astype(np.float)
    data = data[:,2:]
    data = data.astype(np.float)
    new_data = group(data)
    Person_data = new_data[offset-1][0]
    Pos_list = [i for i in range(feature_number)]
    Feature_name = init_feature_name(threshold_name)
    state = transform_data(Person_data, threshold)
    return Pos_list, Feature_name, Person_data, state


def time_list(data):
    time = data[:,1]
    tiem = time.tolist()
    return tiem


def listTodic(date, value):
    target = []
    for item in range(len(date)):
        dic = {}
        dic["date"] = date[item]
        dic["value"] = value[item]
        target.append(dic)
    return target



def specific_data(offset, feature_number):
    data_name = "data.csv"
    data = loadData(data_name)
    new_data = group(data)
    # print(new_data)
    data = new_data[offset-1]
    # print(data)
    data = np.array(data)
    data = data[:, 2:]
    data = data.astype(np.float)
    Time = time_list(new_data[0])
    Person_data = data[:,feature_number]
    Specific_data = listTodic(Time, Person_data)
    print(Specific_data)
    for i in Specific_data:
        print(i)
    return Specific_data


if __name__ == "__main__":
    specific_data(0,0)


# data_name = "data.csv"
# threshold_name = "threshold.csv"
# feature_number = 74
# data = loadData(data_name)
# threshold = loadData(threshold_name)


# id_list = list(set(data[:,0]))
# time_list = list(set(data[:,1]))
# data = data[:,2:]
# new_data = group(data)
# import sys
# sys.exit()

# feature_name = init_feature_name(threshold_name)


# ikt, psyper, constraints, motivation = init_feature_list()
# ikt_label, psyper_label, constraints_label, motivation_label = init_label()
# new_data = group(data)
# for person_data in new_data:

# 	print(person_data[0])
# 	data = transform_data(person_data[0], threshold)
# 	person_current_state_suggestion(data, ikt, psyper, constraints, motivation, ikt_label, psyper_label, constraints_label, motivation_label)
# 	print('--------------------------------------------------------------------------------------------------------------------------------------')
# 	feature_value = person_data[:,3]
# 	name = feature_name[3]
# 	lower = threshold[3][0]
# 	upper = threshold[3][1]
# 	draw_curve(feature_value, lower, upper, name)




