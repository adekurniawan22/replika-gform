const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const FormController = require("../controllers/FormController");
const QuestionController = require("../controllers/QuestionController");
const OptionController = require("../controllers/OptionController");
const AnswerController = require("../controllers/AnswerController");
const InviteController = require("../controllers/InviteController");
const ResponseController = require("../controllers/ResponseController");
const jwtAuth = require("../middlewares/jwtAuth");

// AuthController
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refresh_Token);

// FormController
router.get("/forms", jwtAuth, FormController.index);
router.post("/forms", jwtAuth, FormController.store);
router.get("/forms/:id", jwtAuth, FormController.show);
router.get("/forms/:id/users", jwtAuth, FormController.showToUser);
router.put("/forms/:id", jwtAuth, FormController.update);
router.delete("/forms/:id", jwtAuth, FormController.destroy);

// QuestionController
router.get("/forms/:id/questions", jwtAuth, QuestionController.index);
router.post("/forms/:id/questions", jwtAuth, QuestionController.store);
router.put("/forms/:id/questions/:questionId", jwtAuth, QuestionController.update);
router.delete("/forms/:id/questions/:questionId", jwtAuth, QuestionController.destroy);

// OptionController
router.post("/forms/:id/questions/:questionId/options", jwtAuth, OptionController.store);
router.put("/forms/:id/questions/:questionId/options/:optionId", jwtAuth, OptionController.update);
router.delete("/forms/:id/questions/:questionId/options/:optionId", jwtAuth, OptionController.destroy);

// AnswerController
router.post("/answers/:formId", jwtAuth, AnswerController.store);

// InviteController
router.get("/forms/:id/invites", jwtAuth, InviteController.index);
router.post("/forms/:id/invites", jwtAuth, InviteController.store);
router.delete("/forms/:id/invites", jwtAuth, InviteController.destroy);

// ResponseController
router.get("/responses/:formId/lists", jwtAuth, ResponseController.lists);
router.get("/responses/:formId/summaries", jwtAuth, ResponseController.summaries);

module.exports = router;
