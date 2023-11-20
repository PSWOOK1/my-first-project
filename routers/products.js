// const express = require("express");
// const { Products, Users, Sequelize } = require("../models");
// const router = express.Router();
// const authMiddleware = require("../middlewares/auth-middleware");

// // // 상품 등록

// router.post("/products/registration", async (req, res) => {
//   try {
//     const { ProductsName, content, email, password } = req.body;

//     if (!ProductsName || !content || !email || !password) {
//       return res.status(401).json({
//         success: false,
//         Message: "계정 정보를 다시 확인해주세요",
//       });
//     }

//     // const emailExp = new RegExp(
//     //   /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
//     // );
//     // const emailCheck = emailExp.test(email);
//     // if (!emailCheck) {
//     //   return res.status(401).send({
//     //     success: false,
//     //     message: "이메일 형식이 올바르지 않습니다.",
//     //   });
//     // }

//     const product = new Products({
//       ProductsName,
//       content,
//       email,
//       password: encrypt(password),
//     });
//     await product.save();
//     return res.status(200).json({
//       success: true,
//       Message: "상품 등록에 성공하였습니다.",
//     });
//   } catch (errMessage) {
//     console.error(errMessage);
//     return res.status(400).json({
//       success: false,
//       message: "상품 등록에 실패했습니다.",
//     });
//   }
// });

// // 상품 수정

// // 상품 삭제

// // 상품 목록 조회

// // 상품 상세 조회

// module.exports = router;
