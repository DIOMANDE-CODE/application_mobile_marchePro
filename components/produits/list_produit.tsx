import { stylesCss } from "@/styles/styles";
import { memo } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  View
} from "react-native";

// Declaration des types
type Produit = {
  image: any;
  name: string;
  details: string;
  price: string;
  stock: string;
  stockStyle: object;
};

type ListProduitsProps = {
  data: Produit[];
  onSelectProduit: (index: number) => void;
};

const ListProduits = ({ data, onSelectProduit }: ListProduitsProps) => {
  return (
    <FlatList
      style={styles.content}
      data={data}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <View style={styles.filters}>
          <Pressable style={[styles.filterBtn, styles.filterBtnActive]}>
            <Text style={styles.textLight}>Tous</Text>
          </Pressable>
          <Pressable style={styles.filterBtn}>
            <Text>Poissonnerie</Text>
          </Pressable>
          <Pressable style={styles.filterBtn}>
            <Text>Boucherie</Text>
          </Pressable>
          <Pressable style={styles.filterBtn}>
            <Text>Stocks faibles</Text>
          </Pressable>
        </View>
      }
      renderItem={({ item, index }) => (
        <Pressable
          key={index}
          style={styles.productCard}
          onPress={() => onSelectProduit(index)}
        >
          <Image style={styles.productImage} source={item.image} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDetails}>{item.details}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
          </View>
          <Text style={[styles.productStock, item.stockStyle]}>
            {item.stock}
          </Text>
        </Pressable>
      )}
    />
  );
};

const styles = stylesCss;

export default memo(ListProduits);
