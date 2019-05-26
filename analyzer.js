function analyzer(message) {
    var STATE_PASS_SPACES = 0;

    var STATE_PASS_COMMENTARY_1 = 1;
    var STATE_PASS_COMMENTARY_2 = 2;
    var STATE_PASS_COMMENTARY_3 = 3;
    var STATE_PASS_COMMENTARY_4 = 4;

    var STATE_READ_FIRST_WORD_1_1 = 5;
    var STATE_READ_FIRST_WORD_1_2 = 6;
    var STATE_READ_FIRST_WORD_1_3 = 7;
    var STATE_READ_FIRST_WORD_1_4 = 8;
    var STATE_READ_FIRST_WORD_2_1 = 9;
    var STATE_READ_FIRST_WORD_2_2 = 10;
    var STATE_READ_FIRST_WORD_2_3 = 11;
    var STATE_READ_FIRST_WORD_3_1 = 12;
    var STATE_READ_FIRST_WORD_3_2 = 13;
    var STATE_READ_FIRST_WORD_3_3 = 14;

    var STATE_READ_SECOND_WORD = 15;

    var words = [];
    var messageLen = message.length;
    var state = STATE_PASS_SPACES;
    var i;
    var char;
    var buffer = '';
    for (i = 0; i < messageLen; ++i) {
        char = message[i];

        if (state === STATE_PASS_SPACES) {
            if (isCharIsSpace(char)) {
                continue;
            }
            switch (char) {
                // Начало комментария
                case '/':
                    state = STATE_PASS_COMMENTARY_1;
                    break;
                // Начало первого слова (1010)*
                case '1':
                    state = STATE_READ_FIRST_WORD_1_1;
                    buffer = '1';
                    break;
                // Начало первого слова 010
                case '0':
                    state = STATE_READ_FIRST_WORD_2_1;
                    buffer = '0';
                    break;
                // Начало второго слова
                case 'b':
                    state = STATE_READ_SECOND_WORD;
                    buffer = 'b';
                    break;
            }
        } else if (state === STATE_PASS_COMMENTARY_1) {
            if (char === '*') {
                state = STATE_PASS_COMMENTARY_2;
            } else {
                syntaxError();
            }
        } else if (state === STATE_PASS_COMMENTARY_2) {
            if (char === '*') {
                state = STATE_PASS_COMMENTARY_3;
            } else {
                continue;
            }
        } else if (state === STATE_PASS_COMMENTARY_3) {
            if (char === '/') {
                state = STATE_PASS_SPACES;
            } else {
                syntaxError();
            }
        } else if (state === STATE_READ_FIRST_WORD_1_1) {
            if (char === '0') {
                state = STATE_READ_FIRST_WORD_1_2;
                buffer += '0';
            } else {
                syntaxError();
            }
        } else if (state === STATE_READ_FIRST_WORD_1_2) {
            if (char === '1') {
                state = STATE_READ_FIRST_WORD_1_3;
                buffer += '1';
            } else {
                syntaxError();
            }
        } else if (state === STATE_READ_FIRST_WORD_1_3) {
            if (char === '0') {
                state = STATE_READ_FIRST_WORD_1_4;
                buffer += '0';
            } else {
                syntaxError();
            }
        } else if (state === STATE_READ_FIRST_WORD_1_4) {
            if (char === '1') {
                state = STATE_READ_FIRST_WORD_1_1;
                buffer += '1';
            } else if (char === '0') {
                state = STATE_READ_FIRST_WORD_2_1;
                buffer += '0';
            } else {
                syntaxError();
            }
        } else if (state === STATE_READ_FIRST_WORD_2_1) {
            if (char === '1') {
                state = STATE_READ_FIRST_WORD_2_2;
                buffer += '1';
            } else {
                syntaxError();
            }
        } else if (state === STATE_READ_FIRST_WORD_2_2) {
            if (char === '1') {
                state = STATE_READ_FIRST_WORD_2_3;
                buffer += '1';
            }
        } else if (state === STATE_READ_FIRST_WORD_2_3) {
            if (char === '1') {
                state = STATE_READ_FIRST_WORD_3_1;
                buffer += '1';
            } else {
                --i;
                words.push(buffer);
                buffer = '';
                state = STATE_PASS_SPACES;
            }
        } else if (state === STATE_READ_FIRST_WORD_3_1) {
            if (char === '1') {
                state = STATE_READ_FIRST_WORD_3_2;
                buffer += '1';
            } else {
                syntaxError();
            }
        } else if (state === STATE_READ_FIRST_WORD_3_2) {
            if (char === '1') {
                state = STATE_READ_FIRST_WORD_3_3;
                buffer += '1';
            } else {
                syntaxError();
            }
        } else if (state === STATE_READ_FIRST_WORD_3_3) {
            if (char === '1') {
                state = STATE_READ_FIRST_WORD_3_1;
                buffer += '1';
            } else {
                --i;
                words.push(buffer);
                buffer = '';
                state = STATE_PASS_SPACES;
            }
        } else if (state === STATE_READ_SECOND_WORD) {
            if (char === 'a' || char === 'b' || char === 'c' || char === 'd' || char === 'e') {
                buffer += char;
            } else {
                --i;
                words.push(buffer);
                buffer = '';
                state = STATE_PASS_SPACES;
            }
        }
    }

    if (state !== STATE_PASS_SPACES) {
        syntaxError();
    }

    function isCharIsSpace(char) {
        return char === ' ' || char === "\n" || char === "\r" || char === "\t";
    }

    function syntaxError() {
        console.log('Ошибка в символе ' + i + ': ' + message[i]);
        return false;
    }

    return words;
}