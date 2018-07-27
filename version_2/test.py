import numpy as np
import matplotlib
matplotlib.use('agg')
from matplotlib import pyplot as plt
import random

def draw_curve(name):
    plt.clf()
    x = [i for i in range(100)]
    y = [random.uniform(1650,2400) for i in range(100)]
    plt.plot(x, y, label='data')
    plt.hlines(2150, 0, 100, colors='red', label='upper')
    plt.hlines(1900, 0, 100, colors='green', label='lower')

    plt.xlabel('time')
    plt.ylabel('value')
    plt.title(name)
    plt.legend(loc='upper left')
    plt.savefig(name + '.pdf')

draw_curve('calories')