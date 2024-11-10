import random

class CodedSet:
    def __init__(self):
        self.dig_str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        self.item_dict = {}

    def add_new_entry(self, tick_id):
        new_code = self.gen_code()
        self.item_dict[new_code] = tick_id

    def gen_code(self):
        dig_str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        code_str = ""
        for i in range(19):
            if i % 5 == 4:
                code_str += "-"
            else:
                code_str += random.choice(dig_str)
        if code_str in self.user_dict.keys():
            return self.gen_code()
        return code_str

    def get_item(self, code):
        return self.item_dict[code]