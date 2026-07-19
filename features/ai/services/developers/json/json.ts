import {
  FormatJsonInput,
  MinifyJsonInput,
  RepairJsonInput,
  ValidateJsonInput,
} from "./types";

export async function format({
  json,
  indent = 2,
}: FormatJsonInput) {
  const parsed = JSON.parse(json);

  return {
    valid: true,
    result: JSON.stringify(parsed, null, indent),
  };
}

export async function minify({
  json,
}: MinifyJsonInput) {
  const parsed = JSON.parse(json);

  return {
    valid: true,
    result: JSON.stringify(parsed),
  };
}

export async function validate({
  json,
}: ValidateJsonInput) {
  try {
    JSON.parse(json);

    return {
      valid: true,
      message: "Valid JSON",
    };
  } catch (error) {
    return {
      valid: false,
      message:
        error instanceof Error
          ? error.message
          : "Invalid JSON",
    };
  }
}

export async function repair({
  json,
}: RepairJsonInput) {
  try {
    const parsed = JSON.parse(json);

    return {
      repaired: false,
      result: JSON.stringify(parsed, null, 2),
    };
  } catch {
    return {
      repaired: false,
      error:
        "Automatic JSON repair is not implemented yet.",
    };
  }
}

export const jsonService = {
  format,
  minify,
  validate,
  repair,
};