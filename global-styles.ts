import { StyleSheet } from "react-native";

export const gs = StyleSheet.create({
  bigTitle: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "lightgreen",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },

  h2: {
    marginVertical: 12,
    fontSize: 16,
    fontWeight: "bold",
  },

  label: {
    color: "gray",
    marginVertical: 12,
  },

  text: {
    fontSize: 16,
  },

  secondaryText: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
  },

  noteContainer: {
    backgroundColor: "lightyellow",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },

  flatlist: {
    padding: 16,
  },

  itemContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
});
