"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("/Users/fabienfleisch/Cours/BigDataProject/voice-quiz/nextjs/utils/prisma");
var QuestionType;
(function (QuestionType) {
    QuestionType["tv_cinema"] = "tv_cinema";
    QuestionType["art_litterature"] = "art_litterature";
    QuestionType["musique"] = "musique";
    QuestionType["actu_politique"] = "actu_politique";
    QuestionType["culture_generale"] = "culture_generale";
    QuestionType["sport"] = "sport";
    QuestionType["jeux_videos"] = "jeux_videos";
})(QuestionType || (QuestionType = {}));
var Difficulte;
(function (Difficulte) {
    Difficulte["facile"] = "facile";
    Difficulte["normal"] = "normal";
    Difficulte["difficile"] = "difficile";
})(Difficulte || (Difficulte = {}));
function importNewQuestions(nb, type, diff) {
    return __awaiter(this, void 0, void 0, function () {
        var response, questions;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://quizzapi.jomoreschi.fr/api/v1/quiz?limit=".concat(nb, "&category=").concat(type, "&difficulty=").concat(diff))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    questions = _a.sent();
                    console.log(questions); // Ajoutez cette ligne pour inspecter les données
                    questions.quizzes.forEach(function (apiQuestion) { return __awaiter(_this, void 0, void 0, function () {
                        var question, answer, badAnswers, Question;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!('badAnswers' in apiQuestion)) return [3 /*break*/, 2];
                                    question = apiQuestion.question, answer = apiQuestion.answer, badAnswers = apiQuestion.badAnswers;
                                    Question = {
                                        question: question,
                                        good_answer: answer,
                                        bad_answer_1: badAnswers[0],
                                        bad_answer_2: badAnswers[1],
                                        bad_answer_3: badAnswers[2] || null,
                                        creation_date: new Date()
                                    };
                                    return [4 /*yield*/, prisma_1.prisma.questions.create({
                                            data: {
                                                question: Question.question,
                                                good_answer: Question.good_answer,
                                                bad_answer_1: Question.bad_answer_1,
                                                bad_answer_2: Question.bad_answer_2,
                                                bad_answer_3: Question.bad_answer_3,
                                                creation_date: Question.creation_date
                                            }
                                        })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
// enum QuestionType {
//   tv_cinema = "tv_cinema",
//   art_litterature = "art_litterature",
//   musique = "musique",
//   actu_politique = "actu_politique",
//   culture_generale = "culture_generale",
//   sport = "sport",
//   jeux_videos = "jeux_videos"
// }
// enum Difficulte {
//  facile = "facile",
//  normal = "normal",
//  difficile = "difficile"
// }
importNewQuestions(5, QuestionType.sport, Difficulte.facile);
importNewQuestions(5, QuestionType.sport, Difficulte.normal);
importNewQuestions(5, QuestionType.jeux_videos, Difficulte.facile);
importNewQuestions(5, QuestionType.jeux_videos, Difficulte.normal);
importNewQuestions(5, QuestionType.culture_generale, Difficulte.facile);
importNewQuestions(5, QuestionType.culture_generale, Difficulte.normal);
importNewQuestions(5, QuestionType.actu_politique, Difficulte.facile);
importNewQuestions(5, QuestionType.actu_politique, Difficulte.normal);
importNewQuestions(5, QuestionType.musique, Difficulte.facile);
importNewQuestions(5, QuestionType.musique, Difficulte.normal);
importNewQuestions(5, QuestionType.art_litterature, Difficulte.facile);
importNewQuestions(5, QuestionType.art_litterature, Difficulte.normal);
importNewQuestions(5, QuestionType.tv_cinema, Difficulte.facile);
importNewQuestions(5, QuestionType.tv_cinema, Difficulte.normal);
