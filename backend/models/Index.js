import Carrinho from "./CartModel.js";
import ItemCarrinho from "./CartItemModel.js";

Carrinho.hasMany(ItemCarrinho, {
  foreignKey: "carrinho_id",
  as: "itens",
});

ItemCarrinho.belongsTo(Carrinho, {
  foreignKey: "carrinho_id",
  as: "carrinho",
});

export { Carrinho, ItemCarrinho };
