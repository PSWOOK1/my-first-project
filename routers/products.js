const express = require("express");
const { Products, Users, Sequelize } = require("../models");
const router = express.Router();
const authMiddleware = require("../middlewares/middleware");

// 상품 등록

router.post("/products/registration", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(401).json({
        success: false,
        Message: "실패",
      });
    }
    // 이것들로 유저 찾을거임
    const user = await Users.findOne({
      where: { email: res.locals.user.email },
    });
    // res.locals.user = user.dataValues;
    // res.locals.user 안에 name, email 들어가 있음
    const product = new Products({
      userId: user.id,
      title,
      content,
      status: "for sale",
    });
    await product.save();
    return res.status(200).json({
      success: true,
      Message: "상품 등록에 성공하였습니다.",
    });
  } catch (errMessage) {
    console.error(errMessage);
    return res.status(400).json({
      success: false,
      message: "상품 등록에 실패했습니다.",
    });
  }
});

// 상품 수정
router.put("/products/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(401).json({
        success: false,
        message: "데이터가 올바르지 않습니다.",
      });
    }
    const product = await Products.findOne({ where: { id } });

    // 글쓴이와 로그인 user가 같은지 체크
    // products 의 user 아이디랑 / user 아이디랑 비교
    if (product.userId !== res.locals.user.id) {
      return res.status(401).json({
        success: false,
        message: "수정 권한이 없습니다",
      });
    }

    if (!!product) {
      await product.update({ title, content });
      return res.status(200).json({
        success: true,
        message: "상품이 수정되었습니다",
      });
    }
  } catch (errMessage) {
    console.log(errMessage);
    return res.status(400).json({
      success: false,
      message: "수정 실패",
    });
  }
});

// 상품 삭제
router.delete("/products/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Products.findOne({ where: { id } });
    // 삭제하려는 이가 글쓴이인지 확인
    if (product.userId !== res.locals.user.id) {
      return res.status(401).json({
        success: false,
        message: "삭제 권한이 없습니다",
      });
    }

    // 기존에 있었던 데이터인지 확인 후 맞으면 삭제 완료, 아니면 false
    if (product) {
      await Products.destroy({ where: { id } });
      res.status(200).json({
        success: true,
        message: "삭제 완료",
      });
    }
  } catch (errMessage) {
    console.log(errMessage);
    return res.status(400).json({
      success: false,
      message: "삭제 실패",
    });
  }
});

// 상품 목록 조회
router.get("/products", async (req, res) => {
  try {
    // 1. 모든 상품 정보를 가져오기   (상품 ID   상품상태 상품내용  작성날짜를 추가)
    const product = await Products.findAll({
      attributes: ["title", "id", "status", "content", "createdAt"],
      include: [
        {
          model: Users,
          attributes: ["id", "name", "email"],
        },
      ],
    });
    return res.json({
      success: true,
      message: "조회 성공",
      product,
    });

    // 2. 모든 상품 정보를 전해주자
  } catch (errMessage) {
    console.log(errMessage);
    return res.status(400).json({
      success: false,
      message: "조회 실패",
    });
  }
});

// 상품 상세 조회
router.get("/products/:id", async (req, res) => {
  try {
    // 1. 모든 상품 정보를 가져오기   (상품 ID   상품상태 상품내용  작성날짜를 추가)
    const product = await Products.findOne({
      where: { id: req.params.id },
      attributes: ["title", "id", "status", "content", "createdAt"],
      include: [
        {
          model: Users,
          attributes: ["id", "name", "email"],
        },
      ],
    });
    return res.json({
      success: true,
      message: "조회 성공",
      product,
    });

    // 2. 모든 상품 정보를 전해주자
  } catch (errMessage) {
    console.log(errMessage);
    return res.status(400).json({
      success: false,
      message: "조회 실패",
    });
  }
});

module.exports = router;
