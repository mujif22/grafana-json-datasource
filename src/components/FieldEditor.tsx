import React from 'react';

import { SelectableValue, FieldType } from '@grafana/data';
import { Icon, InlineFieldRow, InlineField, Select, Input } from '@grafana/ui';

import { JsonPathQueryField } from './JsonPathQueryField';
import { JsonField } from 'types';

interface Props {
  limit?: number;
  onChange: (value: JsonField[]) => void;
  onComplete: () => Promise<any>;
  value: JsonField[];
}

export const FieldEditor = ({ value = [], onChange, limit, onComplete }: Props) => {
  const onChangePath = (i: number) => (e: string) => {
    onChange(value.map((field, n) => (i === n ? { ...value[i], jsonPath: e } : field)));
  };

  const onChangeType = (i: number) => (e: SelectableValue<string>) => {
    onChange(
      value.map((field, n) =>
        i === n ? { ...value[i], type: (e.value === 'auto' ? undefined : e.value) as FieldType } : field
      )
    );
  };

  const onAliasChange = (i: number) => (e: any) => {
    onChange(value.map((field, n) => (i === n ? { ...value[i], name: e.currentTarget.value } : field)));
  };

  const addField = (i: number) => () => {
    if (!limit || value.length < limit) {
      onChange([...value.slice(0, i + 1), { name: '', jsonPath: '' }, ...value.slice(i + 1)]);
    }
  };

  const removeField = (i: number) => () => {
    onChange([...value.slice(0, i), ...value.slice(i + 1)]);
  };

  return (
    <>
      {value.map((field, index) => (
        <InlineFieldRow key={index}>
          <InlineField
            label="Field"
            tooltip={
              <div>
                A <a href="https://goessner.net/articles/JsonPath/">JSON Path</a> query that selects one or more values
                from a JSON object.
              </div>
            }
            grow
          >
            <JsonPathQueryField
              onBlur={() => {
                onChange(value);
              }}
              onChange={onChangePath(index)}
              query={field.jsonPath}
              onData={onComplete}
            />
          </InlineField>
          <InlineField label="Type" tooltip="If Auto is set, the JSON property type is used to detect the field type.">
            <Select
              value={field.type ?? 'auto'}
              width={12}
              onChange={onChangeType(index)}
              options={[
                { label: 'Auto', value: 'auto' },
                { label: 'String', value: 'string' },
                { label: 'Number', value: 'number' },
                { label: 'Time', value: 'time' },
                { label: 'Boolean', value: 'boolean' },
              ]}
            />
          </InlineField>
          <InlineField label="Alias" tooltip="If left blank, the field uses the name of the queried element.">
            <Input width={12} value={field.name} onChange={onAliasChange(index)} />
          </InlineField>

          {(!limit || value.length < limit) && (
            <a className="gf-form-label" onClick={addField(index)}>
              <Icon name="plus" />
            </a>
          )}

          {value.length > 1 ? (
            <a className="gf-form-label" onClick={removeField(index)}>
              <Icon name="minus" />
            </a>
          ) : null}
        </InlineFieldRow>
      ))}
    </>
  );
};
