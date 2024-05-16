import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Keyboard,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../app/supabase";

export default function PracticeView() {
  const [nextRep, setNextRep] = React.useState<number>(1);
  const [nextRepText, setNextRepText] = React.useState("");
  const [reps, setReps] = React.useState<any[]>([]);
  const [repsGrid, setRepsGrid] = React.useState(
    Array(10).fill(Array(10).fill(false))
  );

  React.useEffect(() => {
    getAllFromSupabase();
  }, []);

  function lightUpGrid() {
    console.log("LightUpGrid, nextRep = ", nextRep);
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
    setRepsGrid(newRepsGrid);
  }

  React.useEffect(lightUpGrid, [nextRep]);

  async function getAllFromSupabase() {
    try {
      const { data } = await supabase
        .from("Reps")
        .select()
        .eq("practice", "Running")
        .order("created_at", { ascending: true });

      if (data) {
        setNextRep(data.length + 1);
        let tmp: Array<{ repNumber: number; repText: string }> = [];
        for (let rep in data) {
          tmp.push({ repNumber: Number(rep) + 1, repText: data[rep].summary });
        }
        setReps(tmp.reverse());
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function goToNextRep() {
    try {
      await supabase
        .from("Reps")
        .insert({ summary: nextRepText, practice: "Running" });

      setReps((prevReps) => [
        { repNumber: nextRep.toString(), repText: nextRepText },
        ...prevReps,
      ]);

      setNextRep(nextRep + 1);
      setNextRepText("");
      Keyboard.dismiss();
    } catch (e) {
      console.log("Next rep saving error", e);
    }
  }

  const renderRepGridItem = ({ item }: { item: Array<[boolean, string]> }) => (
    <View style={{ flexDirection: "row" }}>
      {item.map((isCompleted, index) => (
        <View
          key={index}
          style={{
            width: 10,
            height: 10,
            backgroundColor: isCompleted ? "green" : "gray",
            margin: 1,
          }}
        />
      ))}
    </View>
  );

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
    >
      <Text
        style={{
          fontSize: 40,
          fontWeight: "bold",
          marginLeft: 12,
          marginBottom: 12,
        }}
      >
        Complete 100 runs to improve my heart health
      </Text>

      <View style={{ flexDirection: "row" }}>
        <View>
          <FlatList
            style={{ marginLeft: 12 }}
            data={repsGrid}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderRepGridItem}
            scrollEnabled={false}
          />
        </View>
        <Text style={{ fontSize: 32, marginLeft: 12 }}>
          Next rep {nextRep.toString()}/100
        </Text>
      </View>

      <Text style={{ fontSize: 16, marginLeft: 12, marginTop: 12 }}>
        Describe the result of the next rep:
      </Text>

      <TextInput
        style={{
          height: 150,
          marginRight: 12,
          marginLeft: 12,
          marginTop: 12,
          marginBottom: 6,
          borderWidth: 1,
          borderColor: "lightgray",
          padding: 10,
        }}
        multiline
        onChangeText={setNextRepText}
        value={nextRepText}
      />

      <View style={{ marginRight: 12, marginLeft: 12, marginBottom: 12 }}>
        <Button
          onPress={goToNextRep}
          title="Close Rep"
          accessibilityLabel="Close the rep and open the next one."
        />
      </View>

      <FlatList
        style={{ marginLeft: 12, marginRight: 12 }}
        data={reps}
        keyExtractor={(item) => item.repNumber}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 5,
              padding: 12,
              marginBottom: 12,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 16,
              }}
            >
              Rep {item.repNumber}: {item.repText}
            </Text>
          </View>
        )}
      />
    </ScrollView>
  );
}
