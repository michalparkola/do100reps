import { View, FlatList } from "react-native";
import React from "react";

interface Props {
  nextRep: number;
  size: number;
}

export default function PracticeGrid({ nextRep, size }: Props) {
  function lightUpGrid(nextRep: number) {
    let newRepsGrid = Array.from({ length: 10 }, () => Array(10).fill(false));

    let repsDone = nextRep - 1;
    let nextRow = 0;

    while (repsDone >= 10) {
      newRepsGrid[nextRow] = Array(10).fill(true);
      nextRow += 1;
      repsDone -= 10;
    }

    let nextCol = 0;
    while (repsDone > 0) {
      newRepsGrid[nextRow][nextCol] = true;
      nextCol += 1;
      repsDone -= 1;
    }
    return newRepsGrid;
  }

  const repsGrid = lightUpGrid(nextRep);

  const renderRepGridItem = ({ item }: { item: Array<[boolean, string]> }) => (
    <View style={{ flexDirection: "row" }}>
      {item.map((isCompleted, index) => (
        <View
          key={index}
          style={{
            width: size,
            height: size,
            backgroundColor: isCompleted ? "green" : "gray",
            margin: size >= 10 ? 1 : 0,
          }}
        />
      ))}
    </View>
  );

  return (
    <FlatList
      data={repsGrid}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderRepGridItem}
      scrollEnabled={false}
    />
  );
}
