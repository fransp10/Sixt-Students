import { QueryResult } from "pg";
import pool from "../pool/db.js";
import {
  CreateUserModelType,
  UserWithoutPasswordType,
  UserWithPasswordType,
} from "../types/User.js";
import { AllowedFieldsType } from "../types/AllowedFieldsType.js";

export async function getUsers(): Promise<UserWithoutPasswordType[]> {
  const result: QueryResult<UserWithoutPasswordType> = await pool.query(
    "SELECT id,username,email,phone,user_role,default_hourly_rate,is_active FROM users",
  );
  return result.rows;
}

export async function createUser({
  username,
  email,
  phone,
  user_role,
  default_hourly_rate,
  password_hash,
}: CreateUserModelType): Promise<UserWithPasswordType> {
  const result: QueryResult<UserWithPasswordType> = await pool.query(
    `INSERT INTO users (
      username, 
      email,
      phone,
      password_hash,
      user_role,
      default_hourly_rate
    )
     VALUES ($1,$2 ,$3,$4,$5,$6) 
     RETURNING 
     id,
     username,
     email,
     phone,
     user_role,
     default_hourly_rate,
     is_active
     `,
    [
      username,
      email ?? null,
      phone ?? null,
      password_hash,
      user_role,
      default_hourly_rate,
    ],
  );
  return result.rows[0];
}

export async function getUserById(
  userId: string,
): Promise<UserWithoutPasswordType | null> {
  const result = await pool.query(
    "SELECT id,username,email,phone,user_role,default_hourly_rate,is_active FROM USERS WHERE id=$1",
    [userId],
  );

  return result.rows[0];
}

export async function updateUser(
  userId: string,
  fieldsToUpdate: Partial<UserWithoutPasswordType>,
): Promise<UserWithoutPasswordType> {
  const allowedFields: AllowedFieldsType[] = [
    "email",
    "phone",
    "user_role",
    "default_hourly_rate",
  ];

  const fields = Object.keys(fieldsToUpdate).filter(
    (field): field is AllowedFieldsType =>
      allowedFields.includes(field as AllowedFieldsType),
  );

  const setClause = fields
    .map((field, index) => `${field}=$${index + 1}`)
    .join(",");

  const values = fields.map((field) => fieldsToUpdate[field]);

  const result: QueryResult<UserWithoutPasswordType> = await pool.query(
    `UPDATE users SET ${setClause} WHERE id=$${fields.length + 1} RETURNING id,username,email,phone,user_role,default_hourly_rate,is_active`,
    [...values, userId],
  );
  return result.rows[0];
}

export async function deactivateUser(
  userId: string,
): Promise<UserWithoutPasswordType> {
  const result: QueryResult<UserWithoutPasswordType> = await pool.query(
    "UPDATE users SET is_active = false WHERE id = $1 RETURNING id,username,email,phone,user_role,default_hourly_rate,is_active",
    [userId],
  );

  return result.rows[0];
}

export async function activateUser(
  userId: string,
): Promise<UserWithoutPasswordType> {
  const result: QueryResult<UserWithoutPasswordType> = await pool.query(
    "UPDATE users SET is_active = true WHERE id = $1 RETURNING id,username,email,phone,user_role,default_hourly_rate,is_active",
    [userId],
  );

  return result.rows[0];
}
