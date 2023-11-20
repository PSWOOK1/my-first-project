require("dotenv").config();

const jwt = require("jsonwebtoken"); // 토큰
const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const encrypt = require("../encrypt/encrypt.js"); // 암호화

// const authMiddleware = require("../middlewares/auth-middleware"); // 미들웨어
const authMiddleware = require("../middlewares/middleware.js"); // 미들웨어
const { enc } = require("crypto-js");

// 회원가입
router.post("/users/sign-up", async (req, res) => {
  try {
    // {
    //     "email": string,
    //     "password": string,
    //     "passwordConfirm": string,
    //     "name": string
    //  }
    const { email, name, password, passwordConfirm } = req.body;
    // 1. 이메일,네임,패스워드,콘필름이 잘 들어왔는지

    // if문으로 만약 틀리면
    // return res.status(401).json sucess 는 false
    // 메세지 : "틀렸습니다"

    if (!email || !name || !password || !passwordConfirm) {
      return res.status(401).json({
        success: false,
        Message: "계정 정보를 다시 확인해주세요",
      });
    }

    // 이메일 형식 맞는지 확인
    const emailExp = new RegExp(
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
    );
    const emailCheck = emailExp.test(email);
    if (!emailCheck) {
      return res.status(401).send({
        success: false,
        message: "이메일 형식이 올바르지 않습니다.",
      });
    }

    //   3. password 길이가 6자보다 짧으면 비번 너무 짧습니다~
    if (password.length < 6) {
      return res.status(401).json({
        success: false,
        Message: "비밀번호가 너무 짧습니다.",
      });
    }

    // 2. if문으로 password, 콘필름 같은지 확인
    // 틀렸으면 메세지 출력

    if (password !== passwordConfirm) {
      return res.status(401).json({
        success: false,
        Message: "passwordConfirm 재확인을 요합니다",
      });
    }

    // 4. 중복되지 않았는지 체크(if 문으로)
    const existsUserName = await Users.findOne({ where: { name } });
    const existsUserEmail = await Users.findOne({ where: { email } });
    if (existsUserName || existsUserEmail) {
      return res.status(401).json({
        success: false,
        message: "이메일 또는 닉네임이 이미 사용중입니다.",
      });
    }

    const user = new Users({ email, name, password: encrypt(password) });
    await user.save();
    return res.status(200).json({
      success: true,
      Message: "회원가입에 성공하였습니다.",
    });
  } catch (errMessage) {
    console.error(errMessage);
    return res.status(400).json({
      success: false,
      message: "실패했습니다.",
    });
  }
});

// 로그인

router.post("/users/log-in", async (req, res) => {
  try {
    const { email, password } = req.body;
    // 예외처리 (데이터 잘 들어왔는지)
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "데이터 형식이 올바르지 않습니다.",
      });
    }

    const user = await Users.findOne({
      where: { email, password: encrypt(password) },
    });

    if (!!user) {
      // user 의 password 랑 우리가 body 로 받은 password가 같은지 체크
      //   if (user.password === encrypt(password)) {
      let expires = new Date();
      expires.setMinutes(expires.getMinutes() + 60 * 12);
      const token = jwt.sign({ email, name: user.name }, process.env.JWT);
      res.cookie("Token", `Bearer ${token}`, { expires });
      res.status(200).json({
        success: true,
        message: "로그인이 성공했습니다",
        token,
      });
      //   } else {
      // return res.status(401).json({
      //   success: false,
      //   message: "password가 일치하지 않습니다.",
      // });
      //   }
    } else {
      //  user 데이터 들어왔는지 check 있으면 login 없으면 없다고 error 메세지 출력
      return res.status(401).json({
        success: false,
        message: "email 또는 password 가 일치하지 않습니다.",
      });
    }
  } catch (errMessage) {
    console.error(errMessage);
    return res.status(400).json({
      success: false,
      message: "실패했습니다.",
    });
  }
});

// 수정

router.put("/users/modify", authMiddleware, async (req, res) => {
  try {
    const { email, password, newpassword } = req.body;
    // 데이터 잘 들어왔는지
    if (!email || !password || !newpassword) {
      return res.status(401).json({
        success: false,
        message: "데이터 형식이 올바르지 않습니다.",
      });
    }

    const user = await Users.findOne({
      where: { email, password: encrypt(password) },
    });
    // user 잘 들어왔는지, 없으면 err
    if (!!user) {
      //   if (user.password === encrypt(password)) {
      // password 도 맞는지 확인
      user.update({ password: encrypt(newpassword) });
      //   성공
      return res.status(200).json({
        success: true,
        Message: "pasword 가 변경되었습니다.",
      });
      //   } else {
      //     return res.status(401).json({
      //       success: false,
      //       message: "기존 password 와 일치하지 않습니다.",
      //     });
      //   }
    } else {
      return res.status(401).json({
        success: false,
        message: "기존 email 또는 password 가 일치하지 않습니다.",
      });
    }
  } catch (errMessage) {
    console.error(errMessage);
    return res.status(400).json({
      success: false,
      message: "실패했습니다.",
    });
  }
});

// 삭제

router.delete("/users/sign-out", authMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;
    // 데이터 형식 확인
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "데이터 형식이 올바르지 않습니다.",
      });
    }

    // 기존에 있었던 데이터인지 확인
    const user = await Users.findOne({
      where: { email, password: encrypt(password) },
    });

    if (!!user) {
      await Users.destroy({ where: { email } });
      res.status(200).json({
        success: true,
        message: "삭제 완료",
      });
    } else {
      res.status(401).json({
        success: false,
        message: "기존 email 또는 password 와 다릅니다.",
      });
    }
    //   user가 있는지 없는지 체크 (맞으면 삭제 , 맞지 않으면 회원 정보가 맞지 않습니다)
  } catch (errMessage) {
    console.error(errMessage);
    return res.status(400).json({
      success: false,
      message: "실패했습니다.",
    });
  }
});

// 로그아웃
router.post("/users/log-out", authMiddleware, async (req, res) => {
  try {
    res.clearCookie("Token");
    res.status(200).json({
      success: true,
      message: "로그아웃 성공",
    });
  } catch (errMessage) {
    console.error(errMessage);
    return res.status(400).json({
      success: false,
      message: "실패했습니다.",
    });
  }
});

module.exports = router;
