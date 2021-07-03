import os
import random

root = "../texts/"
METHOD = ["origin", "cvae", "cvae_bow"]
N_SET = 4
random.seed(0)
text_lists = {}

for split in METHOD:
    with open(root + split + ".txt", "r") as f:
        texts0 = []
        texts1 = []
        for sent in f.readlines():
            if not int(sent.split("\t")[0]):
                texts0.append(sent.split("\t")[1].replace(" ", ""))
            if int(sent.split("\t")[0]):
                texts1.append(sent.split("\t")[1].replace(" ", ""))
    text_lists[split] = {0: texts0, 1: texts1}

print(len(text_lists["origin"][0]))
print(len(text_lists["origin"][1]))
rand_num0 = random.sample(range(len(text_lists["origin"][0])), 100)
rand_num0.sort()
print(rand_num0)
rand_num1 = random.sample(range(len(text_lists["origin"][1])), 100)
rand_num1.sort()

for split in METHOD:
    text0 = [text_lists[split][0][i] for i in rand_num0]
    text1 = [text_lists[split][1][i] for i in rand_num1]
    text_lists[split] = {0: text0, 1: text1}
    print(text_lists[split][0])

for n_set in range(N_SET):
    file_paths = []
    for method in METHOD:
        os.makedirs(f"texts/set{n_set + 1}", exist_ok=True)
        texts = [text_lists[split][0][(i + 1) * (n_set + 1) - 1] for i in range(25)]
        texts.extend(
            [text_lists[split][1][(i + 1) * (n_set + 1) - 1] for i in range(25)]
        )

        with open(f"texts/set{n_set + 1}/{method}.list", mode="w") as f:
            for text in texts:
                f.write(text)
