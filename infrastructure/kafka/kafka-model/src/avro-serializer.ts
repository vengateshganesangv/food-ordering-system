import * as avro from 'avsc';

/**
 * Avro serializer/deserializer helper
 * Provides methods to serialize and deserialize Avro messages
 */
export class AvroSerializer {
  private type: avro.Type;

  constructor(schema: any) {
    this.type = avro.Type.forSchema(schema);
  }

  /**
   * Serialize object to Buffer
   */
  serialize(data: any): Buffer {
    return this.type.toBuffer(data);
  }

  /**
   * Deserialize Buffer to object
   */
  deserialize(buffer: Buffer): any {
    return this.type.fromBuffer(buffer);
  }

  /**
   * Get the Avro schema
   */
  getSchema(): any {
    return this.type.schema();
  }

  /**
   * Validate data against schema
   */
  isValid(data: any): boolean {
    return this.type.isValid(data);
  }
}

/**
 * Factory class to create serializers for different models
 */
export class AvroSerializerFactory {
  private static serializers: Map<string, AvroSerializer> = new Map();

  /**
   * Get or create serializer for a schema
   */
  static getSerializer(schemaName: string, schema: any): AvroSerializer {
    if (!this.serializers.has(schemaName)) {
      this.serializers.set(schemaName, new AvroSerializer(schema));
    }
    return this.serializers.get(schemaName)!;
  }

  /**
   * Clear all cached serializers
   */
  static clear(): void {
    this.serializers.clear();
  }
}
