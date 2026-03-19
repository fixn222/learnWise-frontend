import { CreateButton } from '@/components/refine-ui/buttons/create';
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { ListView } from '@/components/refine-ui/views/list-view';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { DEPARTMENT_OPT } from '@/constants';
import { Subject } from '@/types/index.types';
import { useTable } from '@refinedev/react-table';
import { ColumnDef } from '@tanstack/react-table';
// import { ,  } from '@radix-ui/react-select';
import { Search } from 'lucide-react';
// import { Subject } from 'node_modules/react-hook-form/dist/utils/createSubject';
import React, { useMemo, useState } from 'react'

const SubjectsList = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [seletedDeparment, setSeletedDeparment] = useState('all');
    const departmentFillters = seletedDeparment == 'all' ? [] : [
        {field : 'department' , operator: "eq" as const , value : seletedDeparment}
    ];

    const searchFilters = searchQuery ? [
    {field : 'name' , operator : "contains" as const , value : searchQuery}
    ] : [];



    const subjectTable = useTable<Subject>(
        {
            columns: useMemo<ColumnDef<Subject>[]>(() => [
                {
                    id: 'code',
                    accessorKey: 'code',
                    header: () => <p className='column-title ml-2'>Code</p>,
                    size: 100,
                    cell: ({ getValue }) => <Badge >{getValue<string>()}</Badge>
                },

                {
                    id: 'name',
                    accessorKey: 'name',
                    size: 150,
                    header: () => <p className='column-title ml-2'>Name</p>,
                    cell: ({ getValue }) => <span className='text-foreground'>{getValue<string>()}</span>,
                    filterFn: "includesString"
                },
                {
                    id: 'department',
                    accessorKey: 'departmentgit',
                    size: 250,
                    header: () => <p className='column-title ml-2'>Deparment</p>,
                    cell: ({ getValue }) => <Badge variant={'secondary'}>{getValue<string>()}</Badge>,
                },
                {
                    id: 'description',
                    accessorKey: 'description',
                    size: 300,
                    header: () => <p className='column-title ml-2'>Description</p>,
                    cell: ({ getValue }) => <span className='truncate line-clamp-2'>{getValue<string>()}</span>,
                },


            ], []),
            refineCoreProps: {
                resource: 'subjects',
                pagination: { pageSize: 10, mode: 'server' },
                filters: {
                    permanent :[...departmentFillters , ...searchFilters]
                },
                sorters: {
                    initial : [
                        {field : 'id' , order : 'desc'}
                    ]
                },

            }
        }
    )

    return (
        <ListView>
            <Breadcrumb />
            <h1 className='page-title'>Subjects</h1>

            <div className="intro-row">
                <p>Quick access to essential metrics and managment tools.</p>
                <div className="actions-row">
                    <div className='search-field'>
                        <Search className='search-icon' />
                        <Input type='text' placeholder='search by name'
                            className='pl-10 w-full'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={seletedDeparment} onValueChange={setSeletedDeparment}>

                            <SelectTrigger >
                                <SelectValue placeholder='filter by department' />
                            </SelectTrigger>

                            <SelectContent >
                                <SelectItem value='all'>
                                    All department
                                </SelectItem>
                                {DEPARTMENT_OPT.map((dept) => (
                                    <SelectItem value={dept.value}  >
                                        {dept.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <CreateButton />
                    </div>
                </div>
            </div>

            <DataTable table={subjectTable} />
        </ListView>
    )
}

export default SubjectsList;