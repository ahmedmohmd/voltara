import {pgTable,serial,text,integer,jsonb,timestamp,unique,date,doublePrecision,primaryKey} from "drizzle-orm/pg-core";
export const clients=pgTable("clients",{id:serial("id").primaryKey(),name:text("name").notNull().unique()});
export const months=pgTable("months",{id:serial("id").primaryKey(),clientId:integer("client_id").notNull().references(()=>clients.id,{onDelete:"cascade"}),
year:integer("year").notNull(),month:integer("month").notNull(),analysis:jsonb("analysis").notNull(),createdAt:timestamp("created_at").defaultNow()},t=>[unique().on(t.clientId,t.year,t.month)]);

export const stationDays=pgTable("station_days",{date:date("date").primaryKey(),gens:doublePrecision("gens").notNull(),fuel:doublePrecision("fuel").notNull(),pv:doublePrecision("pv").notNull(),mv:doublePrecision("mv").notNull()});

export const users=pgTable("users",{id:serial("id").primaryKey(),name:text("name").notNull(),email:text("email").notNull().unique(),passwordHash:text("password_hash").notNull(),role:text("role").notNull().default("user"),createdAt:timestamp("created_at").defaultNow()});
export const settings=pgTable("settings",{key:text("key").primaryKey(),value:jsonb("value").notNull()});

export const genDays=pgTable("gen_days",{date:date("date").notNull(),gen:text("gen").notNull(),hours:doublePrecision("hours").notNull(),energy:doublePrecision("energy").notNull(),fuel:doublePrecision("fuel").notNull()},t=>[primaryKey({columns:[t.date,t.gen]})]);

export const tanks=pgTable("tanks",{id:serial("id").primaryKey(),name:text("name").notNull(),capacity:doublePrecision("capacity").notNull()});
export const tankLevels=pgTable("tank_levels",{date:date("date").notNull(),tankId:integer("tank_id").notNull().references(()=>tanks.id,{onDelete:"cascade"}),liters:doublePrecision("liters").notNull()},t=>[primaryKey({columns:[t.date,t.tankId]})]);
