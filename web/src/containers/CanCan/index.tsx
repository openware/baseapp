import * as React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { AbilitiesInterface, RootState, selectAbilities, selectLoadingAbilities } from '../../modules';

interface ReduxProps {
    abilities: AbilitiesInterface;
    loading: boolean;
}

export interface TargetByField {
    name: string;
    field?: string;
}

interface OwnProps {
    action: string;
    target: string | TargetByField;
    children?: React.ReactNode;
}

type Props = ReduxProps & OwnProps;

class CanCanService extends React.Component<Props> {
    public static check = (
        action: string,
        target: string | TargetByField,
        abilities: AbilitiesInterface,
        loading: boolean,
    ) => {
        if (
            !loading &&
            abilities &&
            ((typeof target === 'string' &&
                (CanCanService.checkAbilityByAction(action, target, abilities) ||
                    CanCanService.checkAbilityByAction('read', target, abilities))) ||
                (typeof target === 'object' &&
                    (CanCanService.checkFieldByAction(action, target, abilities) ||
                        CanCanService.checkFieldByAction('read', target, abilities))) ||
                !target)
        ) {
            return true;
        }

        return false;
    };

    public static checkAbilityByAction = (action: string, target: string, abilities: AbilitiesInterface) =>
        abilities[action] && abilities[action].join('::').split('::').includes(target);

    public static checkFieldByAction = (action: string, target: TargetByField, abilities: AbilitiesInterface) =>
        abilities[action] &&
        (CanCanService.checkAbilityByAction(action, target.name, abilities) ||
            (target.field &&
                abilities[action].filter(
                    (item) => item instanceof Object && item[target.name] && item[target.name].includes(target.field),
                ).length) ||
            (!target.field && abilities[action].filter((item) => item instanceof Object && item[target.name]).length));

    public render() {
        const { abilities, action, target, loading } = this.props;

        if (
            !loading &&
            abilities &&
            ((typeof target === 'string' &&
                (this.checkAbilityByAction(action, target) || this.checkAbilityByAction('read', target))) ||
                (target instanceof Object &&
                    (this.checkFieldByAction(action, target) || this.checkFieldByAction('read', target))) ||
                !target)
        ) {
            return this.props.children;
        }

        return null;
    }

    private checkAbilityByAction = (action: string, target: string) => {
        const { abilities } = this.props;

        return abilities[action] && abilities[action].join('::').split('::').includes(target);
    };

    private checkFieldByAction = (action: string, target: TargetByField) => {
        const { abilities } = this.props;

        return (
            abilities[action] &&
            (this.checkAbilityByAction(action, target.name) ||
                (target.field &&
                    abilities[action].filter(
                        (item) =>
                            item instanceof Object && item[target.name] && item[target.name].includes(target.field),
                    ).length) ||
                (!target.field &&
                    abilities[action].filter((item) => item instanceof Object && item[target.name]).length))
        );
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = (state: RootState): ReduxProps => ({
    loading: selectLoadingAbilities(state),
    abilities: selectAbilities(state),
});

export const CanCan = connect(mapStateToProps)(CanCanService);
